
//计时器构造函数
//创建对象时函数参数为DOM节点

function createTimer(id) {
    this.id = document.querySelector(id);
    var addTime = 0;
    var timerStop;
    //开始计时
    this.start = function () {
        //扫雷点击开始直接从1秒开始计时
        addTime += 1;
        this.id.innerText = addTime;
        var itv = function () {
            addTime += 1;
            this.id.innerText = addTime;
        };
        timerStop = setInterval(itv.bind(this), 1000);
    };
    //时间停止
    this.stop = function () {
        clearInterval(timerStop);
    };
    //初始化计时
    this.reset = function () {
        clearInterval(timerStop);
        this.id.innerText = 0;
        addTime = 0;
    };
    //获取时间
    this.getTime = function () {
        return addTime;
    }
}

//让DOM元素具有移动能力
//select为鼠标选择的部分，moveBody为需要移动的整体，其中select必须是moveBody的子元素
function moveElement(select, moveBody) {

    select = document.querySelector(select);
    moveBody = document.querySelector(moveBody);

    if (!select || !moveBody) {
        console.error("[moveElement]:error");
        return;
    }

    //moveBody.style.position = "absolute";

    var stX, stY, mouseDown = false;

    select.addEventListener("mousedown", function (e) {
        stX = e.offsetX;
        stY = e.offsetY;
        mouseDown = true;
    })

    document.addEventListener("mousemove", function (e) {
        if (mouseDown) {
            moveBody.style.left = e.clientX - stX + "px";
            moveBody.style.top = e.clientY - stY + "px";
        }
    }, false)

    document.addEventListener("mouseup", function () {
        mouseDown = false;
    }, false)
}
