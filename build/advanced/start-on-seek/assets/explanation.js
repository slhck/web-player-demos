const refreshButton = document.getElementById('refresh');
const startOnSeekSelect = document.getElementById('startOnSeek');
const explanationText = document.getElementById('explanation-detail');
const explanationPre = `display the pre-roll and then seek to the viewer's last position.`;
const explanationNone = `seek to the viewer's last position without displaying the pre-roll.`;

function updateExplanation() {
    explanationText.textContent = startOnSeekSelect.value === 'pre' ? explanationPre : explanationNone;
}

updateExplanation();

startOnSeekSelect.addEventListener('change', updateExplanation);

refreshButton.addEventListener('click', function() {
    window.location.reload();
});