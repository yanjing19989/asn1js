const
    id = (elem) => document.getElementById(elem),
    contextMenu = id('contextmenu'),
    btnCopyHex = id('btnCopyHex'),
    btnCopyB64 = id('btnCopyB64'),
    btnCopyTree = id('btnCopyTree'),
    btnCopyValue = id('btnCopyValue'),
    btnCopyHexValue = id('btnCopyHexValue'),
    btnDownloadBinValue = id('btnDownloadBinValue');

export function bindContextMenu(node) {
    const type = node.asn1.typeName();
    const valueEnabled = type != 'SET' && type != 'SEQUENCE';
    node.onclick = function (event) {
        // do not show the menu in case of clicking the icon
        if (event.srcElement.nodeName != 'SPAN') return;
        contextMenu.style.left = event.pageX + 'px';
        contextMenu.style.top = event.pageY + 'px';
        contextMenu.style.visibility = 'visible';
        contextMenu.node = this;
        btnCopyValue.style.display = valueEnabled ? 'block' : 'none';
        btnCopyHexValue.style.display = valueEnabled ? 'block' : 'none';
        btnDownloadBinValue.style.display = valueEnabled ? 'block' : 'none';
        event.preventDefault();
        event.stopPropagation();
    };
}

function close(event) {
    contextMenu.style.visibility = 'hidden';
    event.stopPropagation();
}

contextMenu.onmouseleave = close;

btnCopyHex.onclick = function (event) {
    navigator.clipboard.writeText(contextMenu.node.asn1.toHexString('byte'));
    close(event);
};

btnCopyB64.onclick = function (event) {
    event.stopPropagation();
    navigator.clipboard.writeText(contextMenu.node.asn1.toB64String());
    close(event);
};

btnCopyTree.onclick = function (event) {
    event.stopPropagation();
    navigator.clipboard.writeText(contextMenu.node.asn1.toPrettyString());
    close(event);
};

btnCopyValue.onclick = function (event) {
    event.stopPropagation();
    navigator.clipboard.writeText(contextMenu.node.asn1.content());
    close(event);
};

btnCopyHexValue.onclick = function(event) {
    event.stopPropagation();
    navigator.clipboard.writeText(contextMenu.node.asn1.toHexValue('byte'));
    close(event);
};

btnDownloadBinValue.onclick = function (event) {
    event.stopPropagation();
    const startPos = contextMenu.node.asn1.posContent();
    const endPos = contextMenu.node.asn1.posEnd();
    const byteArray = new Uint8Array(endPos - startPos);
    for (let i = startPos, j = 0; i < endPos; i++, j++) {
        byteArray[j] = contextMenu.node.asn1.stream.get(i);
    }
    const blob = new Blob([byteArray], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hex.bin';
    a.click();
    URL.revokeObjectURL(url);
    close(event);
};
