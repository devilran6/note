document.addEventListener("DOMContentLoaded", function() {
    var preBlocks = document.querySelectorAll('pre');
    preBlocks.forEach(function(block) {
        var button = document.createElement('button');
        button.innerHTML = '展示代码';  // 修改按钮文本
        button.className = 'toggle-code-btn';  // 为按钮添加一个类
        button.onclick = function() {
            var codeBlock = block.querySelector('code');
            if (codeBlock.style.display === 'none') {
                codeBlock.style.display = '';
                button.innerHTML = '隐藏代码';  // 当代码块展开时，修改按钮文本
            } else {
                codeBlock.style.display = 'none';
                button.innerHTML = '展示代码';  // 当代码块隐藏时，恢复按钮文本
            }
        };
        block.parentNode.insertBefore(button, block);
        var codeBlock = block.querySelector('code');
        codeBlock.style.display = 'none';
    });
});
