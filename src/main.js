const rq = require('reqwest');

const g = {}; // globals

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

function setupForm(oldData) {

    if (oldData.waiver.validation_notes) {
        g.wavierNotes.innerHTML = `<pre>${oldData.waiver.validation_notes}</pre>`;
    } else {
        g.waiverNotes.style.display = 'none';
    }

    g.waiverForm.style.display = 'block';

    const requiredNodes = ['participant', 'printed_name', 'city'];
    requiredNodes.forEach(node => {
        document.getElementById(node).oninput = (e) => {

            document.getElementById('accept').disabled = !requiredNodes.every(node => {
                return document.getElementById(node).value;
            });
            if (g.waiverType !== 'minor' && node === 'participant') {
                document.getElementById('printed_name').value = document.getElementById('participant').value;
            }
        };
    });

    document.getElementById('clear').onclick = () => g.pencil.clear();

    document.getElementById('accept').onclick = () => {
        const data = {};
        requiredNodes.forEach(node => data[node] = document.getElementById(node).value);
        data.province = document.getElementById('province').value;
        data.sig = g.pencil.toDataURL();
        data.verify_token = g.code;
        console.log(data);
        rq({ url: g.endpoint+'/update_waiver', contentType: 'application/json', crossOrigin: true, method: 'post', type: 'json', data: JSON.stringify(data) })
            .then(() => {
                g.waiverNotes.innerHTML = `<h3>Submission Complete</h3><p>Thank you for submitting your waiver. The Gold Cup team will process your registration and get back to you or your team manager.</p>`;
                g.waiverNotes.style.display = 'block';
                g.waiverForm.style.display = 'none';
            })
            .fail(submitFail);
    }

}

function submitFail() {
    g.waiverNotes.innerHTML = `<h3>Error ${g.failCount ? '#'+g.failCount : ''}</h3><p>Unable to submit the waiver, please wait a few seconds then try again.  If the problem persists please contact the <a href="https://www.gold-cup.ca/content/contact_us">Gold Cup team</a>.</p>`;
    g.waiverNotes.style.display = 'block';
    g.waiverNotes.classList.add('err');
    g.waiverNotes.scrollIntoView();
    if (!g.failCount) {
        g.failCount = 1;
    }
    g.failCount += 1;
}

function fetchFail() {
    g.waiverNotes.classList.add = 'err';
    g.waiverNotes.innerHTML = '<h3>Error</h3><p>Please try again later.  If the problem persists please contact the <a href="https://www.gold-cup.ca/content/contact_us">Gold Cup team</a>.</p>';
}

function init(domNode) {

    g.pencil = new Pencil(domNode, 800, 300);

    g.waiverType = document.getElementById('waiver_type').value;

    g.waiverForm = document.getElementById('waiver_form');
    g.waiverNotes = document.getElementById('waiver_notes');
    g.endpoint = document.documentElement.dataset.endpoint;

    const matches = window.location.href.match(/u=([^\s&]+)/);
    if (!matches) {
        g.waiverNotes.innerHTML = '<h3>No activation code found in URL</h3><p>If you copied and pasted this URL please check that you have copied all the text.</p>';
        g.waiverNotes.style.display = 'block';
        g.waiverNotes.classList.add('err');
    }
    g.code = matches[1];

    g.waiverNotes.innerHTML = '<p>Loading ...</p>';

    rq({ url: g.endpoint+'/get_waiver', contentType: 'application/json', crossOrigin: true, method: 'post', type: 'json', data: `{"verify_token":"${g.code}"}` })
        .then(setupForm)
        .fail(fetchFail);

}

module.exports = {
    init
};
