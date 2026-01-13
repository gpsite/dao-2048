/* js/html_actuator.js (patched) — key additions shown below.
   Rest of file remains the same; these snippets should be inserted into the file.
*/

// --- ensure constructor and existing methods remain unchanged ---

// Add submitScore helper (insert near other methods)
HTMLActuator.prototype.submitScore = function () {
  try {
    var url = window.WEB_APP_URL || (window && window.WEB_APP_URL);
    if (!url || url.indexOf('REPLACE_WITH') !== -1) {
      return; // nothing configured
    }

    var nameEl = document.getElementById('playerName');
    var name = (nameEl && nameEl.value && nameEl.value.trim()) ? nameEl.value.trim() : 'Anonymous';
    var payload = { name: name, score: this.score, game: '2048' };

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(function (resp) {
      return resp.json ? resp.json().catch(function(){return null;}) : null;
    }).then(function (data) {
      if (data && data.status === 'ok') {
        console.log('Score submitted', data);
      } else {
        console.log('Score submission response', data);
      }
    }).catch(function (err) {
      console.warn('Score submission error', err);
    });

  } catch (e) {
    console.warn('submitScore failed', e);
  }
};

// Patch message(won) to call submitScore when the game ends/won
HTMLActuator.prototype.message = function (won) {
  var type    = won ? "game-won" : "game-over";
  var message = won ? "You win!" : "Game over!";

  this.messageContainer.classList.add(type);
  this.messageContainer.getElementsByTagName("p")[0].textContent = message;

  var self = this;
  // Non-blocking submit so UI renders first
  setTimeout(function () { self.submitScore(); }, 0);
};
