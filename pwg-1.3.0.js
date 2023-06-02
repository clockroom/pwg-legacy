'use strict';

const pwg={

	////////////////////////////////////////////////////////

	init() {

		$("#phrase").on("change keyup",function() {
			const hasPhrase=Boolean(this.value);
			$("#phrase").toggleClass("is-invalid",!hasPhrase);
			$('[data-bs-target="#content-home"]').prop("disabled",!hasPhrase).toggleClass("disabled",!hasPhrase);
			localStorage.setItem("phrase",$("#save").prop("checked") ? this.value : "");
		});

		$("#save").change(function() {
			localStorage.setItem("phrase",this.checked ? $("#phrase").val() : "");
		});

		$("#show").click(function() {
			const $phrase=$("#phrase");
			const show=$phrase.prop("type")=="text";
			$("#phrase").prop("type",show ? "password" : "text");
			$("i",this).removeClass("bi-eye-fill bi-eye-slash-fill").addClass(show ? "bi-eye-slash-fill" : "bi-eye-fill")
		});

		$("#domain").on("change keyup",()=>{
			this.updateNormalize();
		});

		$("#domain, #account, #phrase").on("change keyup",()=>{
			this.updateResult();
		});

		$(".result-control").click(function() {
			this.setSelectionRange(0,100);
		});

		$(".result-copy-control").each(function() {
			if(navigator.clipboard)
			{
				const tooltip=new bootstrap.Tooltip(this,{
					trigger: 'manual',
					title: 'コピーしました'
				});

				$(this).click(function() {
					const password=$(".result-control",$(this).parents(".input-group")).val();
					navigator.clipboard.writeText(password).then(()=>{
						tooltip.show()
						setTimeout(()=>{
							tooltip.hide();
						},1000);
					});
				});
			}
			else
			{
				$(this).prop('disabled',true).addClass('disabled');
			}
		});

		this.initPhrase();
		this.updateNormalize();
		this.updateResult();
	},

	initPhrase() {

		const phrase=localStorage.getItem("phrase");
		const hasPhrase=Boolean(phrase);
		const $tabHome=$('[data-bs-target="#content-home"]');
		const $tabSettings=$('[data-bs-target="#content-settings"]');
		const $firstTab=hasPhrase ? $tabHome : $tabSettings;

		$tabHome.prop("disabled",!hasPhrase).toggleClass("disabled",!hasPhrase);

		$("#phrase").toggleClass("is-invalid",!hasPhrase).val(phrase);
		$("#save").prop("checked",hasPhrase);

		(new bootstrap.Tab($firstTab[0])).show();
	},

	updateNormalize() {
		const d=this.domain();
		$("#normalize").text(d==$("#domain").val() ? "" : `( ${d} )`);
	},

	updateResult() {

		const d=this.domain();
		const a=this.account();
		const p=this.phrase();

		$("#result10").val(this.generate(d,a,p,[0,0,0,0,1,1,1,2,2,2]));
		$("#result10-limited").val(this.generate(d,a,p,[4,5,6,4,5,6,4,5,6,5],false));
		$("#result12").val(this.generate(d,a,p,[3,4,5,6,3,4,5,6,4,5,6,5],false));
		$("#result8").val(this.generate(d,a,p,[0,0,0,0,1,1,2,2]));
		$("#result4").val(this.generate(d,a,p,[0,0,0,0],false));
		$("#result-sign").val(this.generate(d,a,p,[6,4,6,4,6,6,4,6,4,6],false));
	},

	////////////////////////////////////////////////////////

	domain() {
		const d=$("#domain").val();
		const m=d.match(/^https?:\/\/([^\/]+)/);
		return m ? m[1] : d;
	},

	account() {
		return $("#account").val();
	},

	phrase() {
		return $("#phrase").val();
	},

	////////////////////////////////////////////////////////

	generate(domain,account,phrase,pattern,splice=true) {

		const charTable=[
			this.charCodeArray("0123456789"),
			this.charCodeArray("abcdefghijklmnopqrstuvwxyz"),
			this.charCodeArray("ABCDEFGHIJKLMNOPQRSTUVWXYZ"),
			this.charCodeArray("!$%+"),
			this.charCodeArray("34679"),
			this.charCodeArray("abdefhknpqrty"),
			this.charCodeArray("ACEFGHJKLMNPRTWXY")
		];

		const rnd=this.random(domain,account,phrase);

		let result="";

		for(let i=0,l=pattern.length;i<l;i++)
		{
			const p=rnd.next()%pattern.length;
			const q=rnd.next()%charTable[pattern[p]].length;

			result+=String.fromCharCode(charTable[pattern[p]][q]);

			if(splice || pattern[p]==3 || pattern[p]==4)
				charTable[pattern[p]].splice(q,1);
			pattern.splice(p,1);
		}

		return result;
	},

	random(domain,account,phrase) {

		const token=this.charCodeArray(domain + account + phrase);

		let rnd=new Xorshift();

		for(let i=0;i<token.length;i++)
		{
			for(let j=0;j<token[i];j++)
				rnd.next();
			rnd=new Xorshift(rnd.next(),rnd.next(),rnd.next(),rnd.next());
		}

		return rnd;
	},

	charCodeArray(value) {
		const result=[];
		for(let i=0;i<value.length;i++)
			result.push(value.charCodeAt(i));
		return result;
	}

	////////////////////////////////////////////////////////
};

pwg.init();
