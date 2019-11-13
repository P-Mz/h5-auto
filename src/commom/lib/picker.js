
const $ = require('jquery');

function picker(data, callback) {

    // 工具方法
    const utils = {

        initValues: function (data) {
            let ret = [];
            data.forEach(function (item, index) {
                let itemData = Array.isArray(item[0]) ? item[0] : item;
                ret.push(itemData[0]);
            });
            return ret;
        },

        toPositions: function (arr) {
            let ret = [];
            const itemH = arr[0].clientHeight;
            for (let i = 0; i < arr.length; i++) {
                ret[i] = { top: -(i * itemH), bottom: -((i + 1) * itemH) };
            }
            return ret;
        },

        scropValue: function (value, max, min) {
            value = Math.max(value, min);
            value = Math.min(value, max);
            return value;
        },

        createEl: function (tag, className, text, parent) {
            let dom = document.createElement(tag);
            dom.className = className || '';
            dom.innerHTML = text || '';
            parent && parent.append(dom);
            return dom;
        },

        renderCol: function (data, pickerCol) {
            const ret = pickerCol || this.createEl('ul', 'picker__col');
            data.forEach(function (item, index) {
                let li = utils.createEl('li', index === 0 ? 'action' : '', item.name);
                li.pickerItem = item;
                ret.append(li);
            });
            return ret;
        },

        // 绑定滚动选中
        handlePickerChange: function (dom, callback) {
            $(dom).on('touchstart', function (e) {
                const pageY = e.touches[0].pageY;
                const self = this;
                const childrens = $(this).children();
                const childrensOffset = utils.toPositions(childrens);
                let scrollTop = 0;

                $(this).on('touchmove', function (ev) {
                    let currentTop = this.currentTop || 0;
                    scrollTop = ev.touches[0].pageY + currentTop - pageY;
                    scrollTop = utils.scropValue(scrollTop, 0, childrensOffset[childrens.length - 1].top);
                    this.style.transform = 'translateY(' + (scrollTop + 'px') + ')';
                });

                $(this).one('touchend', function (ev) {
                    scrollTop = utils.scropValue(scrollTop, 0, childrensOffset[childrens.length - 1].top);
                    let itemH = childrensOffset[0].bottom / 2;

                    childrensOffset.forEach(function (item, index) {
                        if (scrollTop <= (item.top - itemH) && scrollTop >= (item.bottom - itemH)) {
                            childrens[self.currentIndex || 0].className = '';
                            childrens[index].className = 'action';
                            self.style.transform = 'translateY(' + (item.top + 'px') + ')';
                            // 存储标识
                            self.currentIndex = index;
                            self.currentTop = item.top;
                            callback && callback.call(self, index, childrens[index].pickerItem);
                        }
                    });
                });
            });
        },

        renderCols: function (data) {
            // 主要内容
            const pickerContent = utils.createEl('div', 'picker__content');
            let cols = [];

            // 创建元素
            data.forEach(function (item, index) {
                let itemData = Array.isArray(item[0]) ? item[0] : item;
                const pickerCol = utils.renderCol(itemData);
                pickerCol.style.width = ['100%', '50%', '33.33%'][data.length - 1];
                cols.push(pickerCol);
            });

            // 绑定事件
            cols.forEach(function (item, index) {
                utils.handlePickerChange(item, function (pickerItemIndex, pickerItemData) {
                    let nextIndex = index + 1;
                    if (nextIndex < data.length) {
                        cols[nextIndex].innerHTML = '';
                        if (data[nextIndex][pickerItemIndex]) {
                            let subData = data[nextIndex][pickerItemIndex];
                            cols[nextIndex].currentIndex = 0;
                            cols[nextIndex].currentTop = 0;
                            cols[nextIndex].style.transform = 'translateY(0px)';
                            utils.renderCol(subData, cols[nextIndex]);
                            selectValues[nextIndex] = subData[0];
                        } else {
                            selectValues.splice(nextIndex, 1);
                        }
                    }
                    selectValues[index] = pickerItemData;
                });
                pickerContent.append(item);
            });
            return pickerContent;
        }

    }

    // 初始化选中值
    let selectValues = utils.initValues(data);

    // ``````````````````````` 渲染picke ```````````````````````
    const pickerDom = utils.createEl('div', 'picker');
    pickerDom.style = 'transition: opacity 0.3s ease; display: none; opacity: 0;';
    $(pickerDom).on('transitionend', function () { pickerDom.style.display = 'none'; });

    // 遮罩层和内容
    const pickerMask = utils.createEl('div', 'picker__mask', '', pickerDom);
    const pickerMain = utils.createEl('div', 'picker__main', '', pickerDom);

    // 头部
    const pickerTitlebar = utils.createEl('div', 'picker__title-bar', '', pickerMain);
    const cancal = utils.createEl('span', 'cancal', '取消', pickerTitlebar);
    $(cancal).on('click', function () { pickerDom.style.opacity = 0; });
    const confirm = utils.createEl('span', 'confirm', '确认', pickerTitlebar);
    $(confirm).on('click', function () {
        pickerDom.style.opacity = 0;
        callback && callback(selectValues);
    });

    // 选中条
    utils.createEl('div', 'picker__action-line', '', pickerMain);

    // 主要内容
    const pickerContent = utils.renderCols(data);
    pickerMain.append(pickerContent);
    document.body.append(pickerDom);

    $(document.head).append('<style>.picker{position:fixed;width:100%;height:100%;top:0;left:0}.picker .picker__mask{position:absolute;top:0;left:0;right:0;bottom:0;background-color:rgba(0,0,0,0.3)}.picker .picker__main{width:100%;height:8.96rem;position:absolute;left:0;bottom:0;background-color:#fff}.picker .picker__main .picker__title-bar{font-size:.55467rem;height:1.70667rem;display:flex;align-items:center;justify-content:space-between;background-color:#f8f8f8;color:#66ccff}.picker .picker__main .picker__title-bar span{padding:.64rem}.picker .picker__content{position:relative;width:100%;height:7.25333rem;overflow:hidden}.picker .picker__action-line{position:absolute;top:4.608rem;left:0;width:100%;height:1.45067rem;border-top:1px solid #cecece;border-bottom:1px solid #cecece;box-sizing:border-box}.picker .picker__col{float:left;width:50%;height:100%;font-size:.59733rem;text-align:center;padding:2.90133rem 0;box-sizing:border-box}.picker .picker__col li{height:1.45067rem;line-height:1.45067rem;color:#a9a9a9}.picker .picker__col li.action{color:#111;font-size:.72533rem}</style>');

    return {
        open: function () {
            pickerDom.style.display = 'block';
            pickerDom.style.opacity = 1;
        }
    }
}

module.exports = picker;

