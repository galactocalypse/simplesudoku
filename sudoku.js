		var range=5;
		var holesEasy=40;//empty cells in easy level
		var holesMed=50;//empty cells in medium level
		var holesDiff=60;//empty cells in difficult level
		
		var res;
		function digHoles(grid, d){//returns an array of indices the values of which will be removed from the grid
			var holes=0;
			switch(d){
				case 0:holes = holesEasy + parseInt(range*Math.random());break;
				case 1:holes = holesMed + parseInt(range*Math.random());break;
				case 2:holes = holesDiff + parseInt(range*Math.random());break;
				default:return false;
			}
			var ctr=0;
			var unsetcells=[];
			var ng = [];
			for(var i=0;i<grid.length;i++)ng.push(grid[i]);
			while(ctr<holes){
				var x=parseInt(Math.random()*81);
				if(ng[x]>0){ng[x]=0;unsetcells.push(x);ctr++;}
			}
			return unsetcells;
		}

		function formatGrid(){
			$("#grid input[type=text]").attr("readonly",false);
			for(var i=0;i<81;i++){
				var x=$("input[name=c"+i+"]").first().val();
				if(x==""){$("input[name=c"+i+"]").first().addClass("editable");$("input[name=c"+i+"]").first().removeClass("uneditable");}
				else{
					$("input[name=c"+i+"]").first().removeClass("editable");
					$("input[name=c"+i+"]").first().addClass("uneditable");
					$("input[name=c"+i+"]").first().attr("readonly","readonly");
				}
			}
		}


		function loadGrid(d){//loads a new sudoku
			d=parseInt(d);
			if(d<0||d>2)d=0;
			var grid=generate(d);
			
			//console.log(grid);
			
			res = grid;
			var holes = digHoles(grid,d);
			var ctr=0;
			var ng = [];
			
			for(var i=0;i<grid.length;i++)ng.push(grid[i]);
			for(var i=0;i<holes.length;i++){
				ng[holes[i]]=0;				
			}
			setGrid(ng);
			formatGrid();
			//console.log(ng);
			$("#submit").attr("disabled",false);
			$("#showSoln").attr("disabled",false);
			return false;
		}

		function generate(d){//generates the (solved) sudoku
			var arr=new Array(81);
			for(var i=0;i<81;i++)arr[i]=0;
			solve(arr);
			//console.log(arr);
			transform(arr);
			//console.log(arr);
			return arr;
		}
		function transform(arr){//transforms the root solution into various randomized forms
			var x=parseInt(1000*Math.random());
			if(x%2==0)swapRows(arr,0,2);
			else swapRows(arr,1,2);
			if(x%3<2)
			swapCols(arr,1,2);
			if(x>500)
			swapRows(arr,3,4);
			if(x<100)
			swapCols(arr, 3,5);
			else swapCols(arr, 5,4);
			if(x%7<4)
			swapRows(arr,8,6);
			if(x<300)
			morph(arr,'d');
			else if(x<600)
			morph(arr, 'th');
			else morph(arr,'tv');
			//console.log(arr);
			if(x%3<2){
				swapAreas(grid,'h', 0,2);
			}
			else swapAreas(grid,'v', 0,2);
		}

		function addGrid(){//writes the DOM elements(table and input fields)
			var mat=document.createElement("table");
			for(var i=0;i<9;i++){
				var r = document.createElement("tr");
				for(var j=0;j<9;j++){
					var e = document.createElement("td");
					var inp = document.createElement("input");
					var x=i*9+j;//19
					var a=parseInt(x%9);
					var b=parseInt(x/9);
					inp.setAttribute("name","c"+x);
					//inp.setAttribute("name","c"+x);
					inp.setAttribute("value",0);

 					inp.setAttribute("type","text");
					inp.setAttribute("maxlength","1");
					if(((a>=3&&a<=5)&&(b<3||b>=6))||((a<=2||a>=6)&&(b>=3&&b<=5)))
					inp.setAttribute("class","greyed");
					else inp.setAttribute("class","plain");
					
					e.appendChild(inp);
					r.appendChild(e);
				}
				mat.appendChild(r);
			}
			$("#grid").html("");
			$("#grid").get(0).appendChild(mat);
		}

		function getGrid(){//retrieve grid from the displayed table
			var a=[];
			for(var i=0; i < 81; i++){
				var x =parseInt(document.forms["matrix"]["c"+i].value); 
				if(x>0)
					a.push(x);
				else a.push(0);
			}
			//console.log(a);
			return a;
		}

		function setGrid(arr){//set the values in the table
			
			for(var i=0; i < 81; i++)
				if(i<arr.length&&arr[i]>0)document.forms["matrix"]["c"+i].value=arr[i];
				else document.forms["matrix"]["c"+i].value="";
		}

		function getRow(r, grid){//get the array corresponding to row r
			//console.log("Fetching row : "+r);
			if(typeof grid=="undefined"||grid.length!=81)return false;
			var coff = r*9;
			var a = new Array();
			for(var i=0;i<9;i++){
				a.push(grid[coff+i]);
			}

			//console.log(a);
			return a;
		}

		function getCol(c, grid){//get the array corresponding to column c
			if(typeof grid=="undefined"||grid.length!=81)return false;
			var a = new Array();
			for(var i=0;i<9;i++){
				a.push(grid[i*9+c]);
			}

			//console.log(a);
			return a;
		}

		function getBox(b, grid){//get array corresponding to box b
			if(typeof grid=="undefined"||grid.length!=81)return false;
			var coff = (27*parseInt(b/3))+(b%3)*3;
			var a = new Array();
			for(var i=0;i<3;i++){
				for(var j=0;j<3;j++)
					a.push(grid[coff+i*9+j]);
			}

			//console.log(a);
			return a;
		}
		function check(type, num, grid){//check if there are any invalid entries(same number repeated one or more times)
			//type=>0:box, 1:row, 2:col
			if(typeof grid=="undefined"||grid.length!=81)return false;
			var arr;
			switch(type){
				case 0:arr=getBox(num, grid);break;
				case 1:arr=getRow(num, grid);break;
				case 2:arr=getCol(num, grid);break;
				default:return false;
			}
			if(!arr||(arr.length==0))return false;
			else {//console.log(arr);
			}
			var ch = new Array(9);

			for(var i=0;i<9;i++)ch[i]=0;
			for(var i = 0; i < arr.length; i++){//count frequency of occurrence of each number
				if(arr[i]<0||arr[i]>9)return false;
				ch[arr[i]-1]++;
			}
			//console.log("Frequencies: "+ch);
			for(var i=0; i < ch.length; i++)
				if(ch[i]>1)return false;
			//console.log("Valid check made for type:"+type);
			return true;
		}
		function locateCellRCB(id, grid){//find row, col and box of cell
				if(typeof grid=="undefined"||grid.length!=81)return false;
				var a=[];
				if(id<0||id>80)return a;
				var r = parseInt(id/9);
				var c = id%9;
				a['row'] = r;
				a['col'] = c;
				a['box'] = parseInt(r/3)*3 + parseInt(c/3);
				////console.log(a);
				return a;
		}
		function validate(){//checks if a board is completed and correct
			var grid=getGrid();
			//console.log(grid);
			for(var i=0;i<81;i++)
				if(grid[i]==0){alert("Some cells are still unfilled!");return false;}
			for(var i=0;i<9;i++){
				if(!check(0,i,grid))return false;
				if(!check(1,i,grid))return false;
				if(!check(2,i,grid))return false;
			}
			alert("Congratulations!");

			return false;
		}

		function findAvailableCandidates(i,grid){//finds the available candidates for position i in grid
			var arr=[0,0,0,0,0,0,0,0,0];
			var loc=locateCellRCB(i,grid);
			//console.log("Loc : "+loc['row']+", "+loc['col']+", "+loc['box']);
			var r = getRow(loc['row'],grid);
			var c = getCol(loc['col'],grid);
			var b = getBox(loc['box'],grid);

			for(var j=0;j<9;j++){
				arr[r[j]-1]++;
				arr[c[j]-1]++;
				arr[b[j]-1]++;
			}
			//console.log("Row : "+r);
			//console.log("Col : "+c);
			//console.log("Box : "+b);
			
			//console.log("Freq : "+arr);
			var x=[];
			for(var j=0;j<9;j++){
				if(arr[j]==0)x.push(j+1);
			}
			//console.log("Can :"+x);
			return x;
		}
		function solve(grid){//backtracking solution for the grid
			//get next hole
			var i=0;
			while(grid[i]!=0){
				i++;
				if(i==grid.length)return true;
			}
			//console.log("Processing cell : "+i);
			//get possible values
			var can = findAvailableCandidates(i,grid);

			if(can.length==0)return false;//no possible candidates
			else{
				for(var ind=0;ind<can.length;ind++){
					grid[i]=can[ind];
					if(solve(grid)==true){return true;}
					grid[i]=0;
				}
			}
			return false;
		}

		function swapRows(grid, row1, row2){//swap row1 and row2 in grid
			for(var i=0;i<9;i++){
				var t=grid[row1*9+i];
				grid[row1*9+i]=grid[row2*9+i];
				grid[row2*9+i]=t;
			}
		}

		function swapCols(grid, col1, col2){//swap col1 and col2 in grid
			for(var i=0;i<9;i++){
				var t=grid[col1+i*9];
				grid[col1+i*9]=grid[col2+i*9];
				grid[col2+i*9]=t;
			}
		}

		function swapAreas(grid, type, a1, a2){//swap horizontal or vertical areas(groups of three rows/cols)
			//alert("called");
			for(var i=0;i<3;i++){
					for(var j=0;j<9;j++){
					if(type=='h'){
						var t = grid[a1*27+i*9+j];
						grid[a1*27+i*9+j]=grid[a2*27+i*9+j];
						grid[a2*27+i*9+j]=t;
					}
					else if(type=='v'){
						var t=grid[j*9+i+3*a1];
						grid[j*9+i+3*a1]=grid[j*9+i+3*a2];
						grid[j*9+i+3*a2]=t;
					}
				}
			}
			
		}

		function morph(grid,type){//transform the grid
			switch(type){
				case 'th'://horizontal
					for(var i=0;i<4;i++){
						for(var j=0;j<9;j++){
							var t = grid[i*9+j];
							grid[i*9+j]=grid[(8-i)*9+j];
							grid[(8-i)*9+j]=t;
						}							
					}
					break;
				case 'tv':
					for(var i=0;i<4;i++){
						for(var j=0;j<9;j++){
							var t = grid[i+j*9];
							grid[i+j*9]=grid[(8-i)+9*j];
							grid[(8-i)+9*j]=t;
						}							
					}
					break;
				case 'd':
					for(var i=0;i<8;i++){
						for(var j=i+1;j<9;j++){
							var t=grid[i*9+j];
							grid[i*9+j]=grid[j*9+i];
							grid[j*9+i]=t;
						}
					}
					break;	
			}
		}
		function showSolution(){
			setGrid(res);
			$("#submit").attr("disabled","disabled");
			$("#grid input[type=text]").attr("readonly","readonly");
		}
		$(function(){
			addGrid();
			$("#submit").attr("disabled","disabled");
			$("#showSoln").attr("disabled","disabled");
			$("select").change(function(){loadGrid(this.value);});
			$("input[type=text]").change(function(){
				if(isNaN(this.value)){this.value="";alert("Only numbers 1-9 are allowed!");}
				else if(parseInt(this.value)<1||parseInt(this.value)>9){
					this.value = "";
					alert("Only values between 1-9 are allowed!");
				}
			});
			loadGrid(0);
		});
