if(navigator.serviceWorker !== undefined) navigator.serviceWorker.register("serviceworker.js");
var mode = 4, answer, chances = 0;
$("#inputs *").attr("type", "text");
$("#inputs *").attr("maxlength", "1");
$.Events($("#inputs *"),"keydown",e=>{
    var number = parseInt(e.target.id[6]);
    if(e.key == "Backspace" && $(`#number${number}`).value === "" && number != 1){
        back(number);
    }
});
$.Events($("#inputs *"),"input",e=>{
    var number = parseInt(e.target.id[6]);
    if($(`#number${number}`).value !== ""){
        if(isNaN(parseInt($(`#number${number}`).value))) processError("输入的值不是数字", number);
        else if(checkRepeat()) processError("输入的值不能重复", number);
        else if(getNonEmptyInputArray().length == mode){
            var result = checkAnswer();
            chances--;
            $("#output").textContent += `${getNonEmptyInputArray().join("")} - ${result[1]}个位置与数值均相同的答案，${result[0]}个数值相同的答案\n`;
            $("#one-allcorrect").innerText = result[1];
            $("#one-onecorrect").innerText = result[0];
            $("#chances").innerText = chances;
            $("#number1").value = $("#number2").value = $("#number3").value = $("#number4").value = $("#number5").value = $("#number6").value = "";
            if(result[1] == mode){
                $("#inputs *").attr("disabled","");
                $("#about").innerText = "你成功了！";
                enableSelect();
            }
            else if(chances == 0){
                $("#inputs *").attr("disabled","");
                $("#about").innerText = "机会已用尽，祝你下次好运！";
                enableSelect();
            }
            else $("#number1").focus();
        }
        else if(number != mode) forward(number);
    }
    else{
        if(number != 1) back(number);
    }
});
function startGame(){
    $("#game").show();
    disableSelect();
    $("#inputs *").attr("disabled",null);
    if($("#four-checkbox").checked){
        mode = 4;
        chances = 15;
        answer = Array.from(generateNotRepeat(4));
        $("#number5").hide();
        $("#number6").hide();
    }
    else if($("#six-checkbox").checked){
        mode = 6;
        chances = 20;
        answer = Array.from(generateNotRepeat(6));
        $("#number5").show();
        $("#number6").show();
    }
    $("#about").innerText = "guess!";
    $("#output").textContent = "";
    $("#one-allcorrect").innerText = "0";
    $("#one-onecorrect").innerText = "0";
    $("#chances").innerText = chances;
    $("#number1").focus();
}
function forward(number){
    $(`#number${number + 1}`).focus();
}
function back(number){
    $(`#number${number - 1}`).focus();
}
function processError(text, number){
    $(`#number${number}`).value = "";
    $(`#number${number}`).css("outline", "solid 3px crimson");
    $("#errors").css("font-weight", "bold");
    $("#errors").innerText = text;
    setTimeout(_=>{
        $(`#number${number}`).css("outline", null);
        $("#errors").innerText = "目前无错误";
        $("#errors").css("font-weight", null);
    },1000);
}
function checkRepeat(){
    var a = getNonEmptyInputArray();
    var s = new Set(a);
    return a.length !== s.size;
}
function getInputArray(){
    return [$("#number1").value,$("#number2").value,$("#number3").value,$("#number4").value,$("#number5").value,$("#number6").value];
}
function getNonEmptyInputArray(){
    return getInputArray().filter(value=>value !== "");
}
function checkAnswer(){
    var a = getNonEmptyInputArray(), count1 = 0, count2 = 0;
    for(let i = 0; i < answer.length; i++){
        for(let j = 0; j < a.length; j++){
            if(answer[i] == a[j]){
                count1++;
                if(i == j) count2++;
            }
        }
    }
    return [count1, count2];
}
function disableSelect(){
    $("#four-checkbox").attr("disabled","");
    $("#six-checkbox").attr("disabled","");
    $("#start-game").attr("disabled","");
}
function enableSelect(){
    $("#four-checkbox").attr("disabled",null);
    $("#six-checkbox").attr("disabled",null);
    $("#start-game").attr("disabled",null);
}
function generateNotRepeat(length){
    var set = new Set(), result = "";
    while(true){
        set.add((Math.random() * 9).toFixed(0).toString());
        if(set.size == length){
            set.forEach(value=>{
                result += value;
            });
            return result;
        }
    }
}
var toggledAbout = false;
function about(){
    if(toggledAbout) $("#about").innerText = "guess!";
    else $("#about").innerHTML = `
        经典复刻计划之猜数游戏<br />
        由 LJM12914 制作。<br />
        <a target='_blank' href='https://github.com/ljm12914/guess'>https://github.com/ljm12914/guess</a>
    `;
    toggledAbout = !toggledAbout;
}