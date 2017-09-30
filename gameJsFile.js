
/*
 * 作者：张晓雷
 * 微博：weibo.com/333199500
 * 邮箱：zhangxiaolei@outlook.com
*/

(function (document) {

    //屏蔽右键
    document.querySelector("#minesweeper").oncontextmenu = function (e) {
        e.preventDefault();
    }

    //计时器构造函数
  
    function createTimer(id) {
        this.id = document.querySelector(id);
        var addTime = 0;
        var timerStop;
        var itv = function () {
            addTime += 1;
            this.id.innerText = addTime;
        };

        //开始计时
        this.start = function () {
            //扫雷点击开始直接从1秒开始计时
            addTime += 1;
            this.id.innerText = addTime;
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

    //判断一个数组是否在另一个数组内
    function haveArr(arr, arrlist) {
        for (var item of arrlist) {
            if (arr.toString() === item.toString()) {
                return true;
            }
        }
    }

    
    //随机对象
    var random = {
        random: function () {
            return Math.random();
        },
        randint: function (begin, end) {
            if (begin > end) {
                [begin, end] = [end, begin];
            }
            return parseInt(Math.random() * (end - begin + 1) + begin);
        },
    };

    //主体对象
    function msp(id) {

        this.id = id;

        this.qs = function (name, doc) {
            return (doc || document).querySelector(name);
        };

        this.qsA = function (name, doc) {
            return (doc || document).querySelectorAll(name);
        };

        this.c = function (type) {
            return document.createElement(type);
        }

        this.ce = function (type, k, v) {
            var el = document.createElement(type);
            el.setAttribute(k, v);
            return el;
        };

        this.attr = function (el, k, v) {
            el.setAttribute(k, v);
        };

        this.append = function (parent, child) {
            parent.appendChild(child);
        };

        this.event = function (el, type, fn) {
            el.addEventListener(type, fn.bind(this), false)
        }
    }
    //检查坐标范围
    msp.prototype.check = function (y, x) {
        var my, mx;
        y = parseInt(y);
        x = parseInt(x);
        my = this.lineY - 1;
        mx = this.lineX - 1;
        if (((y - 1 >= -1 && y <= my) && (y + 1 <= my + 1 && y >= 0)) && ((x - 1 >= -1 && x <= mx) && (x + 1 <= mx + 1 && x >= 0))) {
            return true;
        } else {
            return false;
        }
    }

    //给一个坐标，返回周围八个坐标
    msp.prototype.getAround = function (y, x) {
        var a = [];
        this.check(y - 1, x - 1) && a.push([y - 1, x - 1])
        this.check(y - 1, x) && a.push([y - 1, x])
        this.check(y - 1, x + 1) && a.push([y - 1, x + 1])
        this.check(y, x + 1) && a.push([y, x + 1])
        this.check(y + 1, x + 1) && a.push([y + 1, x + 1])
        this.check(y + 1, x) && a.push([y + 1, x])
        this.check(y + 1, x - 1) && a.push([y + 1, x - 1])
        this.check(y, x - 1) && a.push([y, x - 1])
        return a;
    }

    //创建桌面，生成对象
    msp.prototype.createDesk = function (lineY, lineX) {

        this.deskEle = this.qs(this.id);
        this.lineY = lineY;
        this.lineX = lineX;

        var tr, td;

        var cover, coverTop, coverMiddle, coverBottom;
        var clueTop, clue;
        var mine, mineCover, mineMine, minebg;

        this.table = [];
        this.box = Object.create(null);
        this.start = false;
        for (var y = 0; y < this.lineY; y++) {
            tr = this.c("tr");
            this.box[y] = Object.create(null);
            for (var x = 0; x < this.lineX; x++) {
                td = this.c("td");
                this.box[y][x] = Object.create(null);
                //td
                this.table.push(td);
                //cover
                cover = this.ce("div", "class", "cover");
                coverTop = this.ce("div", "class", "coverTop");
                coverMiddle = this.ce("div", "class", "coverMiddle");
                coverBottom = this.ce("div", "class", "coverBottom");
                this.attr(coverTop, "style", "background-color :" + initGame.startColorBG.cover);
                this.attr(coverBottom, "style", "background-color :" + initGame.startColorBG.cover);
                this.append(cover, coverTop)
                this.append(cover, coverMiddle)
                this.append(cover, coverBottom)

                //clue
                clueTop = this.ce("div", "class", "clueTop");
                clue = this.ce("div", "class", "clue");
                //mine
                mine = this.ce("div", "class", "mine");
                mineCover = this.ce("div", "class", "mineCover");
                mineMine = this.ce("div", "class", "mineMine");
                minebg = this.ce("div", "class", "minebg");
                this.append(mine, mineCover);
                this.append(mine, mineMine);
                this.append(mine, minebg);

                //核心对象
                this.box[y][x] = {
                    mark: 0,
                    swep: 0,
                    done: 0,
                    has: 0,
                    clue: 0,
                    y: y,
                    x: x,
                    select: 0
                }

                this.box[y][x].el = {
                    td: td,
                    cover: cover,
                    coverTop: coverTop,
                    coverBottom: coverBottom,
                    clueTop: clueTop,
                    clue: clue,
                    mineCover: mineCover
                }
                //ALL
                this.append(td, cover);
                this.append(td, clueTop);
                this.append(td, clue);
                this.append(td, mine);
                td.dataset.loc = y + ":" + x;
                this.append(tr, td);
            }
            this.append(this.deskEle, tr);
        }
    }


    //设置地雷
    msp.prototype.settleBombs = function (n, ny, nx) {
        var notList = this.getAround(ny, nx);
        notList.push([ny, nx]);
        var y, x;
        while (n) {
            do {
                y = random.randint(0, this.lineY - 1);
                x = random.randint(0, this.lineX - 1);
            } while (haveArr([y,x], notList));

            if (!(this.box[y][x].has)) {
                this.box[y][x].has = 1;
                this.box[y][x].mark = 1;
                n -= 1;
            }
        }
    }

    //标记地雷信息
    msp.prototype.markupBombs = function () {
        var sum = 0;
        for (var y = 0; y < this.lineY; y++) {
            for (var x = 0; x < this.lineX; x++) {
                this.getAround(y,x).forEach( (p)=> {
                    sum += this.box[p[0]][p[1]].has;
                })
                this.box[y][x].clue = sum > 0 ? sum : "";
                this.box[y][x].mark = sum > 0 ? 2 : 0;
                sum = 0;
            }
        }
    }

    //控制单个方块区域的开合
    msp.prototype.cubeDisplay = function (el, n) {
        if (n === "mk") {
            //标记
            el.coverTop.style.display = "none";
        } else if (n === "op") {
            //打开
            el.cover.style.display = "none";
        } else if (n === "exp") {
            //爆炸
            el.cover.style.display = "none";
            el.mineCover.style.display = "none";
        } else if (n === "rst") {
            //恢复
            el.cover.style.display = "block";
            el.coverTop.style.display = "block";
            el.mineCover.style.display = "block";
        }
    }

    //触雷，游戏结束
    msp.prototype.bombs = function () {

        this.timer.stop();

        this.end = true;

        if (mx.level === 1) {
            initGame.normalNum += 1;
            initGame.normalSucWin = 0;
            initGame.normalSucLost += 1;
            initGame.normalSucLostSave = initGame.normalSucLost > initGame.normalSucLostSave ?
                initGame.normalSucLost :
                initGame.normalSucLostSave;

        } else if (mx.level === 2) {
            initGame.middleNum += 1;
            initGame.middleSucWin = 0;
            initGame.middleSucLost += 1;
            initGame.middleSucLostSave = initGame.middleSucLost > initGame.middleSucLostSave ?
                initGame.middleSucLost :
                initGame.middleSucLostSave;

        } else if (mx.level === 3) {
            initGame.hardNum += 1;
            initGame.hardSucWin = 0;
            initGame.hardSucLost += 1;
            initGame.hardSucLostSave = initGame.hardSucLost > initGame.hardSucLostSave ?
                initGame.hardSucLost :
                initGame.hardSucLostSave;
        }

        saveGameData();

        for (var y = 0; y < this.lineY; y++) {
            for (var x = 0; x < this.lineX; x++) {
                if (this.box[y][x].has) {
                    this.cubeDisplay(this.box[y][x].el, "exp");
                }
            }
        }
    }

    //为每一个方块添加具体的动作事件
    msp.prototype.sweeper = function () {

        var save8 = [];
        var haveX;
        //全局鼠标事件，这样当双键按下鼠标以后，即便是移除tb区域，依然能触发恢复特效事件
        this.event(document, "mouseup", function (event) {
            if (haveX) haveX.innerText = "";
            if (save8) {
                if (event.button === 2 || event.button === 0) {
                    for (var item of save8) {
                        item.style.opacity = "1";
                    }
                    save8 = [];
                }
            }
        })

        this.table.forEach((td) => {
            //this.table是一个数组，存放所有的td
            //通过td的dataset属性获取当前元素坐标
            var loc = td.dataset.loc;
            var y = parseInt(loc.slice(0, loc.indexOf(":")));
            var x = parseInt(loc.slice(loc.indexOf(":") + 1));

            //this.event方法会修该绑定方法的this，改为对象的this
            this.event(td, "mousedown", function (event) {

                //游戏结束，不允许再操作
                if (this.end) {
                    return;
                }

                //左键
                if (event.buttons === 1) {

                    if (!this.start) {
                        //如果游戏第一次点击，触发时间计时
                        //获取当前坐标，开始布雷
                        this.timer.start();
                        this.restart(this.level, y, x);
                        this.end = false;
                    }

                    this.start = true;

                    //确保方块还未动作
                    if (this.box[y][x].swep !== 1) {
                        //直接触雷
                        if (this.box[y][x].has) {
                            this.bombs();

                        } else {
                            //点击的位置有信息
                            if (this.box[y][x].mark === 2) {
                                this.cubeDisplay(this.box[y][x].el, "op");
                                this.box[y][x].el.clue.innerText = this.box[y][x].clue;
                                this.box[y][x].done = 1;
                                this.checkWin();
                            } else {
                                //什么都没有，启动区域清理
                                this.cubeDisplay(this.box[y][x].el, "op");
                                this.box[y][x].mark = 3;
                                this.box[y][x].done = 1;
                                this.uncoverEmpty();
                            }
                        }
                    }
                } else if (event.buttons === 2) {
                    //右键
                    if (this.box[y][x].select === 0) {
                        with (this.box[y][x]) {
                            if (!done) {
                                this.cubeDisplay(el, "mk");
                                bombsNum.innerText = parseInt(bombsNum.innerText) - 1;
                                swep = 1;
                                has && ( done = 1 );
                                select = 1;
                            }
                        }
                        this.checkWin();
                    } else if (this.box[y][x].select === 1) {
                        with (this.box[y][x]) {
                            el.coverTop.style.display = "block";
                            el.coverTop.innerText = "?";
                            bombsNum.innerText = parseInt(bombsNum.innerText) + 1;
                            swep = 0;
                            done = 0;
                            select = 2;
                        }
                    } else if (this.box[y][x].select === 2) {
                        with (this.box[y][x]) {
                            el.coverTop.style.display = "block";
                            el.coverTop.innerText = "";
                            select = 0;
                        }
                    }
                } else if (event.buttons === 3) {
                    //双键
                    var sum = 0;

                    var swep8 = [];
                    //获取周围雷的信息
                    this.getAround(y,x).forEach( (p) => {
                        sum += this.box[p[0]][p[1]].swep;
                        swep8.push(this.box[p[0]][p[1]])
                    })

                    //如果标注的红旗和提示信息数量一致
                    if (sum === this.box[y][x].clue) {
                        for (var item of swep8) {
                            with (this.box[item.y][item.x]) {
                                if (!has) {
                                    done = 1;
                                    if (mark === 0) mark = 3;
                                    el.td.style.opacity = "1";
                                    this.cubeDisplay(el, "op");
                                    el.clue.innerText = clue;
                                } else {
                                    if (!(swep === 1)) {
                                        this.bombs();
                                    }
                                }
                            }
                        }
                        this.uncoverEmpty();
                    } else {
                        for (var item of swep8) {
                            if (!this.box[item.y][item.x].done) {
                                this.box[item.y][item.x].el.td.style.opacity = "0.5";
                                save8.push(this.box[item.y][item.x].el.td)
                            }
                        }
                        if (this.box[y][x].clue) {
                            this.box[y][x].el.clueTop.innerText = "╳";
                            haveX = this.box[y][x].el.clueTop;
                        }
                    }
                }
            });
        })
    }

    //清理整片的空白区域
    msp.prototype.uncoverEmpty = function () {
        var sum = 0;
        var stop = true;
        while (stop) {
            for (var y = 0; y < this.lineY; y++) {
                for (var x = 0; x < this.lineX; x++) {
                    if (this.box[y][x].mark === 3) {
                        this.getAround(y,x).forEach( (p) => {
                            with(this.box[p[0]][p[1]]){
                                if (mark === 0) {
                                    this.cubeDisplay(el, "op");
                                    mark = 3;
                                    done = 1;
                                    sum++;
                                } else if (mark === 2) {
                                    this.cubeDisplay(el, "op");
                                    el.clue.innerText = clue;
                                    done = 1;
                                }
                            }
                        })
                    }
                }
            }
            stop = sum ? true : false;
            sum = 0;
        }
        this.checkWin();
    }

    //检查游戏是否赢了
    msp.prototype.checkWin = function () {

        for (var y = 0; y < this.lineY; y++) {
            for (var x = 0; x < this.lineX; x++) {
                if (!this.box[y][x].done) {
                    return false;
                }
            }
        }

        this.end = true;

        if (this.level === 1) {
            initGame.normalNum += 1;
            initGame.normalWin += 1;
            initGame.normalSucWin += 1;
            initGame.normalSucWinSave = initGame.normalSucWin > initGame.normalSucWinSave ?
                initGame.normalSucWin :
                initGame.normalSucWinSave;
            initGame.normalSucLost = 0;
            initGame.normalBest.push(this.timer.getTime() + " : " + new Date().getTime());
            initGame.normalBest.sort(sortControl);
            if (initGame.normalBest.length > 5) {
                initGame.normalBest.pop();
            }

        } else if (this.level === 2) {
            initGame.middleNum += 1;
            initGame.middleWin += 1;
            initGame.middleSucWin += 1;
            initGame.middleSucWinSave = initGame.middleSucWin > initGame.middleSucWinSave ?
                initGame.middleSucWin :
                initGame.middleSucWinSave;
            initGame.middleSucLost = 0;
            initGame.middleBest.push(this.timer.getTime() + " : " + new Date().getTime());
            initGame.middleBest.sort(sortControl);
            if (initGame.middleBest.length > 5) {
                initGame.middleBest.pop();
            }

        } else if (this.level === 3) {
            initGame.hardNum += 1;
            initGame.hardWin += 1;
            initGame.hardSucWin += 1;
            initGame.hardSucWinSave = initGame.hardSucWin > initGame.hardSucWinSave ?
                initGame.hardSucWin :
                initGame.hardSucWinSave;
            initGame.hardSucLost = 0;
            initGame.hardBest.push(this.timer.getTime() + " : " + new Date().getTime());
            initGame.hardBest.sort(sortControl);
            if (initGame.hardBest.length > 5) {
                initGame.hardBest.pop();
            }
        }

        saveGameData();
        this.timer.stop();
        winBox(this, 12);
    }

    //重新开始游戏
    msp.prototype.restart = function (level, ny, nx) {
        var n;
        if (level === 1) {
            n = 10;
        } else if (level === 2) {
            n = 40;
        } else if (level === 3) {
            n = 99;
        }
        this.settleBombs(n, ny, nx);
        this.markupBombs();
    }

    //----------main----------------//
    //创建对象
    var mx = new msp("#desk");

    //创建保存数据的初始对象
    var init = {
        //初始难度
        startLevel: 1,
        //颜色
        startColorBG: {
            cover: "rgb(100,180,120)"
        },
        //五次最好成绩
        normalBest: [],
        middleBest: [],
        hardBest: [],
        //总数量
        normalNum: 0,
        middleNum: 0,
        hardNum: 0,
        //赢的数量
        normalWin: 0,
        middleWin: 0,
        hardWin: 0,
        //连胜
        normalSucWin: 0,
        normalSucWinSave: 0,
        middleSucWin: 0,
        middleSucWinSave: 0,
        hardSucWin: 0,
        hardSucWinSave: 0,
        //连输
        normalSucLost: 0,
        normalSucLostSave: 0,
        middleSucLost: 0,
        middleSucLostSave: 0,
        hardSucLost: 0,
        hardSucLostSave: 0
    }

    //保存数据函数
    function saveGameData() {
        if (window.localStorage) {
            if (initGame) {
                localStorage.setItem("initData", JSON.stringify(initGame));
            } else {
                localStorage.setItem("initData", JSON.stringify(init));
            }
        }
    }
    //读取保存数据
    var initGame = JSON.parse(localStorage.getItem("initData"));

    //如果是第一次打开，将其指向初始对象
    if (!initGame) {
        initGame = init;
    }

    var bombsNum = mx.qs("#mineNum");

    mx.timer = new createTimer("#timer");

    mx.level = initGame.startLevel;

    if (mx.level === 1) {
        mx.createDesk(9, 9);
        bombsNum.innerText = 10;
    } else if (mx.level === 2) {
        mx.createDesk(16, 16);
        bombsNum.innerText = 40;
    } else if (mx.level === 3) {
        mx.createDesk(16, 30);
        bombsNum.innerText = 99;
    }

    //-----------------生成动作-------------------
    mx.sweeper();
    //---------------------------------------------

    var setList = mx.qs("#setList");
    var setting = mx.qs("#setting");

    //----------选项图标动作-----------------------
    mx.event(setting, "mouseover", function () {
        setList.style.display = "block";
    })

    mx.event(setting, "mouseout", function () {
        setList.style.display = "none";
    })

    mx.event(setList, "mouseout", function () {
        setList.style.display = "none";
    })

    //----难度选项------
    //----一般-------
    mx.event(mx.qs("#normal"), "click", function () {
        this.timer.reset();
        setList.style.display = "none";
        this.start = false;
        this.end = false;
        this.level = 1;
        bombsNum.innerText = 10;
        this.deskEle.innerHTML = "";
        initGame.startLevel = 1;
        saveGameData();
        this.createDesk(9, 9);
        this.sweeper();
    })
    //------中等----------
    mx.event(mx.qs("#middle"), "click", function () {
        this.timer.reset();
        setList.style.display = "none";
        this.start = false;
        this.end = false;
        this.level = 2;
        bombsNum.innerText = 40;
        this.deskEle.innerHTML = "";
        initGame.startLevel = 2;
        saveGameData();
        this.createDesk(16, 16);
        this.sweeper();
    })
    //---------困难----------------
    mx.event(mx.qs("#hard"), "click", function () {
        this.timer.reset();
        setList.style.display = "none";
        this.start = false;
        this.end = false;
        this.level = 3;
        bombsNum.innerText = 99;
        this.deskEle.innerHTML = "";
        initGame.startLevel = 3;
        saveGameData();
        this.createDesk(16, 30);
        this.sweeper();
    })

    //----------重新开始------------------------
    mx.event(mx.qs("#restart"), "click", function () {

        if (this.level === 1) {
            bombsNum.innerText = 10;
        } else if (this.level === 2) {
            bombsNum.innerText = 40;
        } else if (this.level === 3) {
            bombsNum.innerText = 99;
        }

        this.timer.reset();
        setList.style.display = "none";
        this.start = false;
        this.end = false;
        for (var y = 0; y < this.lineY; y++) {
            for (var x = 0; x < this.lineX; x++) {
                with (this.box[y][x]) {
                    this.cubeDisplay(el, "rst");
                    mark = 0;
                    swep = 0;
                    done = 0;
                    has = 0;
                    clue = 0;
                    el.clue.innerText = "";
                    el.coverTop.innerText = "";
                    select = 0;
                }
            }
        }
    })


    //--------------------统计功能区域-------------------

    var selectNormal = mx.qs("#selectNormal");
    var selectMiddle = mx.qs("#selectMiddle");
    var selectHard = mx.qs("#selectHard");
    var gamesInfo = mx.qs("#gamesInfo");
    var leftInfo = mx.qsA("#win5 li", gamesInfo);
    var rightInfo = mx.qsA("#win5info li span", gamesInfo);

    //格式化时间
    function formatTime(t) {
        return (t.replace(/\d+$/, function (a) {
            var t = new Date();
            t.setTime(a);
            return t.getFullYear() + "/" + (t.getMonth() + 1) + "/" + t.getDate();
        }))
    }
    //top5排序控制函数
    function sortControl(a, b) {
        var ia, fa, ib, fb;
        ia = parseInt(a.slice(0, a.indexOf(".")));
        fa = parseInt(a.slice(a.indexOf(".") + 1));
        ib = parseInt(b.slice(0, b.indexOf(".")));
        fb = parseInt(b.slice(b.indexOf(".") + 1));
        if (ia !== ib) {
            return ia - ib;
        } else {
            return fa - fb;
        }
    }

    //----------弹出统计信息
    mx.event(mx.qs("#STTInfo"), "click", function () {

        var mainWindowY = this.qs("#minesweeper").offsetTop;
        var mainWindowX = this.qs("#minesweeper").offsetLeft;

        if (this.level === 1) {
            gamesInfo.style.top = parseInt(mainWindowY) + 80 + "px";
            gamesInfo.style.left = parseInt(mainWindowX) - 15 + "px";
        } else if (this.level === 2) {
            gamesInfo.style.top = parseInt(mainWindowY) + 93 + "px";
            gamesInfo.style.left = parseInt(mainWindowX) - 20 + "px";
        } else if (this.level === 3) {
            gamesInfo.style.top = parseInt(mainWindowY) + 93 + "px";
            gamesInfo.style.left = parseInt(mainWindowX) + 5 + "px";
        }

        gamesInfo.style.display = "block";
        setList.style.display = "none";
        //默认为一般难度
        selectNormal.style.backgroundColor = "skyblue";
        selectMiddle.style.backgroundColor = "#F6EFEF";
        selectHard.style.backgroundColor = "#F6EFEF";
        //数据开始
        rightInfo[0].innerText = initGame.normalNum;
        rightInfo[1].innerText = initGame.normalWin;
        rightInfo[2].innerText = parseInt((initGame.normalWin / initGame.normalNum || 0) * 100) + "%";
        rightInfo[3].innerText = initGame.normalSucWinSave;
        rightInfo[4].innerText = initGame.normalSucLostSave;
        //--------------
        for (var i = 0; i < initGame.normalBest.length; i++) {
            leftInfo[i].innerText = formatTime(initGame.normalBest[i]);
        }
    })


    //----------选择要看的难度---------------------
    mx.event(mx.qs("#selectNormal"), "click", function () {

        selectNormal.style.backgroundColor = "skyblue";
        selectMiddle.style.backgroundColor = "#F6EFEF";
        selectHard.style.backgroundColor = "#F6EFEF";

        rightInfo[0].innerText = initGame.normalNum;
        rightInfo[1].innerText = initGame.normalWin;
        rightInfo[2].innerText = parseInt((initGame.normalWin / initGame.normalNum || 0) * 100) + "%";
        rightInfo[3].innerText = initGame.normalSucWinSave;
        rightInfo[4].innerText = initGame.normalSucLostSave;
        //----

        for (var j = 0; j < 5; j++) {
            leftInfo[j].innerText = "";
        }

        for (var i = 0; i < initGame.normalBest.length; i++) {
            leftInfo[i].innerText = formatTime(initGame.normalBest[i]);
        }
    })

    mx.event(mx.qs("#selectMiddle"), "click", function () {
        selectNormal.style.backgroundColor = "#F6EFEF";
        selectMiddle.style.backgroundColor = "skyblue";
        selectHard.style.backgroundColor = "#F6EFEF";

        rightInfo[0].innerText = initGame.middleNum;
        rightInfo[1].innerText = initGame.middleWin;
        rightInfo[2].innerText = parseInt((initGame.middleWin / initGame.middleNum || 0) * 100) + "%";
        rightInfo[3].innerText = initGame.middleSucWinSave;
        rightInfo[4].innerText = initGame.middleSucLostSave;
        //----

        for (var j = 0; j < 5; j++) {
            leftInfo[j].innerText = "";
        }

        for (var i = 0; i < initGame.middleBest.length; i++) {
            leftInfo[i].innerText = formatTime(initGame.middleBest[i]);
        }
    })

    mx.event(mx.qs("#selectHard"), "click", function () {
        selectNormal.style.backgroundColor = "#F6EFEF";
        selectMiddle.style.backgroundColor = "#F6EFEF";
        selectHard.style.backgroundColor = "skyblue";

        rightInfo[0].innerText = initGame.hardNum;
        rightInfo[1].innerText = initGame.hardWin;
        rightInfo[2].innerText = parseInt((initGame.hardWin / initGame.hardNum || 0) * 100) + "%";
        rightInfo[3].innerText = initGame.hardSucWinSave;
        rightInfo[4].innerText = initGame.hardSucLostSave;
        //-----
        for (var j = 0; j < 5; j++) {
            leftInfo[j].innerText = "";
        }

        for (var i = 0; i < initGame.hardBest.length; i++) {
            leftInfo[i].innerText = formatTime(initGame.hardBest[i]);
        }

    })


    mx.event(mx.qs("#close"), "click", function () {
        var gamesInfo = mx.qs("#gamesInfo");
        gamesInfo.style.display = "none";
    })

    //------------------游戏胜利-------------------

    var winInfo = mx.qs("#winInfo");

    function winBox(mx, t) {

        if (mx.level === 1) {
            winInfo.style.left = 0.2 + "em";
            winInfo.style.top = 5.2 + "em";
        } else if (mx.level === 2) {
            winInfo.style.left = 4.4 + "em";
            winInfo.style.top = 8.5 + "em";
        } else if (mx.level === 3) {
            winInfo.style.left = 12.8 + "em";
            winInfo.style.top = 8.5 + "em";
        }

        winInfo.style.display = "block";

        mx.qs("#spendTime", winInfo).innerText = mx.timer.getTime();

    }

    mx.event(mx.qs("#winInfoBT"), "click", function () {
        mx.attr(winInfo, "style", "display : none");
    })

    //-------------------颜色更改--------------------
    mx.event(mx.qs("#bluebg"), "click", function () {
        for (var y = 0; y < this.lineY; y++) {
            for (var x = 0; x < this.lineX; x++) {
                this.box[y][x].el.coverTop.style.backgroundColor = "rgb(60,130,200)";
                this.box[y][x].el.coverBottom.style.backgroundColor = "rgb(60,130,200)";
            }
        }
        setList.style.display = "none";
        initGame.startColorBG.cover = "rgb(60,130,200)";
        saveGameData();
    })

    mx.event(mx.qs("#greenbg"), "click", function () {
        for (var y = 0; y < this.lineY; y++) {
            for (var x = 0; x < this.lineX; x++) {
                this.box[y][x].el.coverTop.style.backgroundColor = "rgb(100,180,120)";
                this.box[y][x].el.coverBottom.style.backgroundColor = "rgb(100,180,120)";
            }
        }
        setList.style.display = "none";
        initGame.startColorBG.cover = "rgb(100,180,120)";
        saveGameData();
    })

    mx.event(mx.qs("#redbg"), "click", function () {
        for (var y = 0; y < this.lineY; y++) {
            for (var x = 0; x < this.lineX; x++) {
                this.box[y][x].el.coverTop.style.backgroundColor = "rgb(230,110,155)";
                this.box[y][x].el.coverBottom.style.backgroundColor = "rgb(230,110,155)";
            }
        }
        setList.style.display = "none";
        initGame.startColorBG.cover = "rgb(230,110,155)";
        saveGameData();
    })

    //关于
    var about_box = mx.qs("#about_box");
    mx.event(mx.qs("#about"), "click", function () {
        var mainWindowY = this.qs("#minesweeper").offsetTop;
        var mainWindowX = this.qs("#minesweeper").offsetLeft;

        about_box.style.top = mainWindowY + 80 + "px";
        about_box.style.left = mainWindowX + 30 + "px";

        about_box.style.display = "block";
    })

    mx.event(mx.qs("#about_close"), "click", function () {
        about_box.style.display = "none";
    })


    //让窗口具有移动功能
    moveElement("#nav", "#minesweeper");
    moveElement("#gamesInfo #top", "#gamesInfo");
    moveElement("#about_title", "#about_box");

})(document);
