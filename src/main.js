const rq = require('reqwest');

function Pencil(canvas, width, height) {
    let drawing = false;
    const ctx = canvas.getContext('2d');

    canvas.width = width;
    canvas.height = height;

    function drawSegment(e) {
        if (drawing) {
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
        }
    }

    canvas.addEventListener('mousedown', e => {
        drawing = true;
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.moveTo(e.offsetX, e.offsetY);
    }, false);

    canvas.addEventListener('mouseup', e => {
        drawSegment(e);
        drawing = false;
    }, false);

    canvas.addEventListener('mouseout', e => {
        drawSegment(e);
        drawing = false;
    }, false);


    canvas.addEventListener('mousemove', drawSegment, false);

    return {
        clear: () => ctx.clearRect(0, 0, width, height),
        toDataURL: () => canvas.toDataURL()
    }
}

function init(domNode) {

    const p = new Pencil(domNode, 800, 300);

    const requiredNodes = ['participant', 'printed_name', 'city'];
    const waiverType = document.getElementById('waiver_type').value;

    document.getElementById('clear').onclick = () => p.clear();
    requiredNodes.forEach(node => {
        document.getElementById(node).oninput = (e) => {

            document.getElementById('accept').disabled = !requiredNodes.every(node => {
                return document.getElementById(node).value;
            });
            if (waiverType !== 'minor' && node === 'participant') {
                document.getElementById('printed_name').value = document.getElementById('participant').value;
            }
        };
    });
    document.getElementById('accept').onclick = () => {
        const data = {};
        requiredNodes.forEach(node => data[node] = document.getElementById(node).value);
        data.prov = document.getElementById('prov').value;
        data.sig = p.toDataURL();
        console.log(data);
        rq({url:'http://localhost/', method:'post', data })
            .then(() => { console.info('Send success'); });
    }
}

module.exports = {
    init
};
