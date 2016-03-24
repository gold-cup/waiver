const rq = require('reqwest');

function init(domNode) {
    domNode.width = 800;
    domNode.height = 300;
    const c = new fabric.Canvas(domNode, {isDrawingMode: true});
    fabric.Object.prototype.transparentCorners = false;
    c.freeDrawingBrush.color = '#222';
    c.freeDrawingBrush.width = 9;
    const requiredNodes = ['participant', 'printed_name', 'city'];

    document.getElementById('clear').onclick = () => c.clear();
    requiredNodes.forEach(node => {
        document.getElementById(node).oninput = (e) => {

            document.getElementById('accept').disabled = !requiredNodes.every(node => {
                return document.getElementById(node).value;
            });
        };
    });
    document.getElementById('accept').onclick = () => {
        const data = {};
        requiredNodes.forEach(node => data[node] = document.getElementById(node).value);
        data.sig = c.toDataURL();
        console.log(data);
        rq({url:'http://localhost/', method:'post', data })
            .then(() => { console.info('Send success'); });
    }
}

module.exports = {
    init
};
