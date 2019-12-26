const $ = require('jquery');
const picker = require('./common/lib/picker');

const p1 = picker([
    [
        { name: '初级', id: '' },
        { name: '中级', id: '' },
        { name: '高级', id: '' },
        { name: '终级', id: '' },
    ]
], data => {
    console.log(data);
});


$('#btn').on('click', () => {
    p1.open();
});