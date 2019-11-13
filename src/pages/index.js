import '../commom/lib/hotcss';
import $ from 'jquery';
import picker from '../commom/lib/picker';

const p1 = picker([
    [
        { name: '初级', id: '' },
        { name: '中级', id: '' },
        { name: '高级', id: '' },
        { name: '终级', id: '' },
    ]
]);


$('#btn').on('click', () => {
    p1.open();
});