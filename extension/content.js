window.onload = async function () {
  chrome.storage.local.set({ "background": "#08AB67" })
  const parsed_URL = window.location.href.split('/').slice(-1).toString().slice(0, 12);

  function $el(tag, props) {
    let p, el = document.createElement(tag);
    if (props) {
      for (p in props) {
        el[p] = props[p];
      }
    }
    return el;
  }

  (function () {
    let modal = $el('div', {});
    modal.className = 'badge-modal'
    modal.innerHTML = `
    <div class="close-button-wrapper">
      <span class="close-badge-modal">Close</span>
    </div>
      <div class="badge-modal-body">
        <button>
          <img src="https://talk-time-server.herokuapp.com/active_listener.png" />
          <span>Active Listener</span>
        </button>
        <button>
          <img src="https://talk-time-server.herokuapp.com/areas_of_agreement.png" />
          <span>Areas of Agreement</span>
        </button>
        <button>
          <img src="https://talk-time-server.herokuapp.com/ask_for_feedback.png" />
          <span>Ask for Feedback</span>
        </button>
        <button>
          <img src="https://talk-time-server.herokuapp.com/bee_brief.png" />
          <span>Bee brief</span>
        </button>
        <button>
          <img src="https://talk-time-server.herokuapp.com/brainstormer.png" />
          <span>Brainstormer</span>
        </button>
        <button>
          <img src="https://talk-time-server.herokuapp.com/check_for_understanding.png" />
          <span>Check for Understanding</span>
        </button>
        <button>
          <img src="https://talk-time-server.herokuapp.com/clarifing_question.png" />
          <span>Clarifing Questions</span>
        </button>
        <button>
          <img src="https://talk-time-server.herokuapp.com/decide.png" />
          <span>Decide</span>
        </button>
        <button>
          <img src="https://talk-time-server.herokuapp.com/define_the_problem.png" />
          <span>Define the Problem</span>
        </button>
        <button>
          <img src="https://talk-time-server.herokuapp.com/disagreement_solver.png" />
          <span>Desagreement Solver</span>
        </button>
        <button>
          <img src="https://talk-time-server.herokuapp.com/encourageing_knowlege.png" />
          <span>Encourageing Knowlege</span>
        </button>
        <button>
          <img src="https://talk-time-server.herokuapp.com/give_feedback.png" />
          <span>Give Feedback</span>
        </button>
        <button>
          <img src="https://talk-time-server.herokuapp.com/helper.png" />
          <span>Helper</span>
        </button>
        <button>
          <img src="https://talk-time-server.herokuapp.com/ideas_evaluation.png" />
          <span>Ideas Evaluation</span>
        </button>
        <button>
          <img src="https://talk-time-server.herokuapp.com/info_shareer.png" />
          <span>Info Shareer</span>
        </button>
        <button>
          <img src="https://talk-time-server.herokuapp.com/mic_earned.png" />
          <span>Mic Earned</span>
        </button>
        <button>
          <img src="https://talk-time-server.herokuapp.com/muting_maestro.png" />
          <span>Muting Maestro</span>
        </button>
        <button>
          <img src="https://talk-time-server.herokuapp.com/norms_meeting.png" />
          <span>Norms Meeting</span>
        </button>
        <button>
          <img src="https://talk-time-server.herokuapp.com/notes_master.png" />
          <span>Notes Master</span>
        </button>
        <button>
          <img src="https://talk-time-server.herokuapp.com/online_tools.png" />
          <span>Online Tools</span>
        </button>
        <button>
          <img src="https://talk-time-server.herokuapp.com/problem_pauser.png" />
          <span>Problem Pauser</span>
        </button>
        <button>
          <img src="https://talk-time-server.herokuapp.com/questions.png" />
          <span>Questions</span>
        </button>
        <button>
          <img src="https://talk-time-server.herokuapp.com/ready_headset_go.png" />
          <span>Ready Headset Go</span>
        </button>
        <button>
          <img src="https://talk-time-server.herokuapp.com/resource_vs_impact.png" />
          <span>Resource vs Impact</span>
        </button>
        <button>
          <img src="https://talk-time-server.herokuapp.com/screenshare.png" />
          <span>Screenshare</span>
        </button>
        <button>
          <img src="https://talk-time-server.herokuapp.com/stay_on_topic.png" />
          <span>Stay on Topic</span>
        </button>
        <button>
          <img src="https://talk-time-server.herokuapp.com/teacher.png" />
          <span>Teacher</span>
        </button>
        <button>
          <img src="https://talk-time-server.herokuapp.com/time_earning.png" />
          <span>Time Earning</span>
        </button>
        <button>
          <img src="https://talk-time-server.herokuapp.com/to_do_tracker.png" />
          <span>To Do Tracker</span>
        </button>
        <button>
          <img src="https://talk-time-server.herokuapp.com/zen_enviroment.png" />
          <span>Zen Evniroment</span>
        </button>
      </div>
    `
    modal.style.display = 'none'
    document.body.appendChild(modal)
  })()


  const createSendMessageModal = (username) => {
    let modal = $el('div', {});
    modal.className = 'modal hidden'
    modal.innerHTML = `
        <h2 class="modal-title">Do you want send message to the ${username}?</h2>
        <input class="modal-message" placeholder="Enter your message" maxlength="200" name="message" />
        <div>
          <button class="modal-send">Send Message</button>
          <button class="modal-cancel">Cancel</button>
        </div>
    `
    document.querySelector('body').appendChild(modal)
  }
  // Default config
  // These values may be overridden by values retrieved from server
  let config = {
    participants_selector: 'div[role="list"][aria-label="Participants"]',
    pulse_timeslice: 500,
    min_talk_time_to_show: 2000
  };
  let options = {};
  let data = {};
  let participants_list = null;
  let totaltalktime = 0;
  let groups = {
    "a": { "participants": {} },
    "b": { "participants": {} },
    "c": { "participants": {} },
    "d": { "participants": {} }
  };
  let update_display_required = false;

  let dom_container = null;
  let dom_table = null;
  let dom_total = null;

  // ==================================================================
  // UTIL
  // ==================================================================

  // UTIL: DOM
  // ---------
  function parent(el, selector) {
    //console.log("parent",el);
    if (el.matches && el.matches(selector)) { return el; }
    if (el.parentNode) { return parent(el.parentNode, selector); }
    return null;
  }

  // UTIL: TIME FORMATTING
  // ---------------------
  function formatTime(t) {
    try {
      if (!t) {
        return "";
      }
      let m = Math.floor(t / 60);
      let s = Math.floor(t - (m * 60));
      return m + " : " + (("" + s).replace(/^(\d)$/, "0$1"));
    } catch (e) {
      console.log(e);
      return "";
    }
  }
  function getFormattedTotalTime(record) {
    if (!record || !record.total) { return ""; }
    return formatTime(record.total / 1000);
  }
  function getFormattedTotalPercent(record) {
    if (!record || !record.total || !totaltalktime) { return ""; }
    let pctstr = "";
    if (record.total && totaltalktime) {
      let pct = (record.total / totaltalktime) * 100;
      if (pct > 100) { pct = 100; } // somehow?
      pctstr = pct.toFixed(0) + "%";
    }
    return pctstr;
  }

  // ==================================================================
  // DOM CREATION
  // ==================================================================

  // The container for the UI
  function createContainer() {
    dom_container = $el('div', { id: "talk-time-container" });
    dom_container.innerHTML = `
    <div class="talk-time-top" title="Click to collapse/expand">
      <img class="talk-time-logo" style=" filter: grayscale(1) invert(1);" src="https://cdn-icons-png.flaticon.com/24/1827/1827379.png" />
      <svg class="talk-time-options-gear" title="Talk Time Options" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 13.616v-3.232c-1.651-.587-2.694-.752-3.219-2.019v-.001c-.527-1.271.1-2.134.847-3.707l-2.285-2.285c-1.561.742-2.433 1.375-3.707.847h-.001c-1.269-.526-1.435-1.576-2.019-3.219h-3.232c-.582 1.635-.749 2.692-2.019 3.219h-.001c-1.271.528-2.132-.098-3.707-.847l-2.285 2.285c.745 1.568 1.375 2.434.847 3.707-.527 1.271-1.584 1.438-3.219 2.02v3.232c1.632.58 2.692.749 3.219 2.019.53 1.282-.114 2.166-.847 3.707l2.285 2.286c1.562-.743 2.434-1.375 3.707-.847h.001c1.27.526 1.436 1.579 2.019 3.219h3.232c.582-1.636.75-2.69 2.027-3.222h.001c1.262-.524 2.12.101 3.698.851l2.285-2.286c-.744-1.563-1.375-2.433-.848-3.706.527-1.271 1.588-1.44 3.221-2.021zm-12 2.384c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z"/></svg>
    </div>
    <div class="talk-time-options-content">
      <h3>Options</h3>
      <p style="font-style:italic;">Change color of talk time</p>
      <input type="color" class="change_color_input" /><br />
      <button class="talk-time-options-close">Close</button>
    </div>
    <div class="talk-time-header">
      <div class="talk-time-show-groups">Show Groups</div>
      <div class="talk-time-hide-groups">Hide Groups</div>
      <div class="talk-time-summary">Total Talk Time: <span id="talk-time-summary-total"></span></div>
    </div>
    <div class="talk-time-body">
      <table class="talk-time-table"><tbody></tbody></table>
      ${createGroupTable()}
    </div>
  `;
    document.body.appendChild(dom_container);
    dom_table = dom_container.querySelector('table');
    dom_total = dom_container.querySelector('#talk-time-summary-total');
    let onclick = function (selector, f) {
      dom_container.querySelector(selector).addEventListener('click', f);
    };
    onclick('.talk-time-top', () => { dom_container.classList.toggle("collapsed"); });
    onclick('.talk-time-show-groups', () => { dom_container.classList.add('show_groups'); });
    onclick('.talk-time-hide-groups', () => { dom_container.classList.remove('show_groups'); });
    onclick('.talk-time-options-gear', (e) => {
      e.stopPropagation();
      dom_container.classList.add('talk-time-options');
      let changeColorInput = document.querySelector('.change_color_input');
      changeColorInput.onchange = function () {
        chrome.storage.local.set({ "background": this.value });
        chrome.storage.local.get(['background'], function (storage) {
          let { background } = storage;
          const allSendMessageButtons = document.querySelectorAll('.send-message-button');
          allSendMessageButtons.forEach(button => {
            if (!button.disabled) {
              button.style.background = background;
              button.style.border = `1px solid ${background}`;
            }
          })
          let talkTimeTop = document.querySelector('.talk-time-top');
          let closeOptionsButton = document.querySelector('.talk-time-options-close')
          talkTimeTop.style.background = background;
          closeOptionsButton.style.background = background;
        })
      }

    });
    onclick('.talk-time-options-close', () => { dom_container.classList.remove("talk-time-options"); });
  }

  // Create the group rendering table
  function createGroupTable() {
    let table = `<table id="talk-time-group-table" class="talk-time-table talk-time-group-table"><tbody>`;
    ['a', 'b', 'c', 'd'].forEach(group => {
      table += `
    <tr id="talk-time-group-row-${group}" class="talk-time-group-row">
      <td><div contenteditable="true" title="Click to edit label" class="talk-time-group-label talk-time-group-selector-${group}">${group.toUpperCase()}</div></td>
      <td id="talk-time-group-total-${group}" class="talk-time-group-total talk-time-time"></td>
      <td id="talk-time-group-pct-${group}" class="talk-time-group-pct talk-time-pct"></td>
      <td>Avg/person: </td>
      <td id="talk-time-group-avg-${group}" class="talk-time-group-avg talk-time-avg"></td>
    </tr>`;
    });
    table += `</tbody></table>`;
    return table;
  }

  // A participant's row
  function createParticipantRow(record) {
    if (!record) { return; }
    let row = $el('tr');
    row.setAttribute('data-name', record.name)
    row.innerHTML = `
        <td class="talk-time-name">${record.name}</td>
        <td class="talk-time-time">0:00</td>
        <td class="talk-time-pct unique_pct_selector">0%</td>
        <button class="send-message-button">Send Message</button>
        <button class="give-badge-button">Give Badge</button>
        <td class="talk-time-groups">${createParticipantRowGroups(record)}</td>
      `;
    record.row = row;
    record.time_display = row.querySelector('.talk-time-time');
    record.pct_display = row.querySelector('.talk-time-pct');
    // Attach click listeners to the groups
    row.querySelectorAll('.talk-time-group-selector-container > *').forEach(el => {
      el.addEventListener('click', () => {
        let group = el.dataset.group;
        let selected = !el.classList.contains('selected');
        el.classList.toggle('selected', selected);
        groups[group].participants[record.id] = selected;
        // Force an immediate re-rendering of groups summary because data may have changed
        updateGroupTotals();
      })
    });
    return row;
  }

  // Create the group selectors that go into each participant's row
  function createParticipantRowGroups() {
    return `
    <div class="talk-time-group-selector-container" title="Click groups to add this participant's time to a group bucket">
      <div class="talk-time-group-selector talk-time-group-selector-a" data-group="a">A</div>
      <div class="talk-time-group-selector talk-time-group-selector-b" data-group="b">B</div>
      <div class="talk-time-group-selector talk-time-group-selector-c" data-group="c">C</div>
      <div class="talk-time-group-selector talk-time-group-selector-d" data-group="d">D</div>
    </div>
    `;
  }

  // ==================================================================
  // DATA PROCESSING
  // ==================================================================

  // Init a participant the first time we hear from them
  // ---------------------------------------------------
  function init_participant(id) {
    let record = {
      "id": id,
      "total": 0,
      "last_start": 0,
      "last": 0,
      "name": "",
      "time_display": null,
      "pct_display": null,
      "update_required": false,
      "groups": {},
      "visible": false
    };
    getParticipantName(record);
    return record;
  }

  // Retrieve a participant's name from the DOM
  // ------------------------------------------
  function getParticipantName(record) {
    if (!record || !record.id || record.name) { return; }
    const listitem = document.querySelector(`div[role="listitem"][data-participant-id="${record.id}"]`);
    if (listitem) {
      // The first span in the container has the name
      const spans = listitem.querySelectorAll('span');
      if (spans && spans.length) {
        record.name = spans[0].innerHTML;
      }
    }
  }

  function createQualityModal() {
    const modal = $el('div')
    modal.className = 'bad-internet-connection'
    modal.innerHTML = `
    <span class="bad-internet-text">Your internet isn't good, so other people can't hear you well!</span>
    <button class="close-bad-internet-modal">Close</button>
    `
    modal.style.display = 'none'
    document.body.appendChild(modal)
  }
  createQualityModal()

  // ==================================================================
  // DOM UPDATES
  // ==================================================================
  function talking(record) {
    record.talking = true;
    if (record && record.row && record.row.classList) {
      record.row.classList.add("talking");
    }
  }
  function notTalking(record) {
    record.talking = false;
    if (record && record.row && record.row.classList) {
      record.row.classList.remove("talking");
    }
  }
  function updateParticipant(record) {
    if (!record) { return; }
    if (!record.row) {
      record.row = createParticipantRow(record);
      dom_table.appendChild(record.row);
    }
    if (record && record.update_required && record.total >= config.min_talk_time_to_show) {
      record.time_display.textContent = getFormattedTotalTime(record);
    }
    record.pct_display.textContent = getFormattedTotalPercent(record);
    record.update_required = false;
  }
  function updateGroupTotals() {
    let group, p, any_active = false;
    for (group in groups) {
      let record = groups[group];
      let active = false;
      record.total = 0;
      record.count = 0;
      for (p in record.participants) {
        if (!record.participants.hasOwnProperty(p)) { continue; }
        if (record.participants[p]) {
          // User is in group
          active = true;
          record.total += data[p].total;
          record.count++;
        }
      }
      if (active) {
        any_active = true;
        document.querySelector(`#talk-time-group-total-${group}`).textContent = getFormattedTotalTime(record);
        document.querySelector(`#talk-time-group-pct-${group}`).textContent = getFormattedTotalPercent(record);
        document.querySelector(`#talk-time-group-avg-${group}`).textContent = formatTime(record.total / 1000 / record.count);
      }
      document.querySelector(`#talk-time-group-row-${group}`).style.display = active ? "table-row" : "none";
    }
    document.querySelector('#talk-time-group-table').style.display = any_active ? "block" : "none";
  }

  // Update the display on a regular interval
  function render(force) {
    try {
      if (!force && !update_display_required) {
        return;
      }
      dom_total.textContent = formatTime(totaltalktime / 1000);
      let id;
      for (id in data) {
        if (!data.hasOwnProperty(id)) { continue; }
        let record = data[id];
        updateParticipant(record);
      }
      // Put them in talk order
      let ids = Object.keys(data);
      ids.sort(function (a, b) {
        if (data[a].total < data[b].total) { return 1; }
        if (data[a].total > data[b].total) { return -1; }
        return 0;
      });
      let needs_reordering = false;
      ids.forEach((id, i) => {
        let record = data[id];
        if (needs_reordering || !record.order || record.order !== i) {
          needs_reordering = true;
          if (record.row && record.row.parentNode) {
            record.row.parentNode.appendChild(record.row);
          }
          record.order = i;
        }
      });
      // Update the groups
      updateGroupTotals();

      update_display_required = false;
    } catch (e) {
      console.log(e);
    }
  }
  setInterval(render, 1000);

  // let loudlyModal = document.querySelector('.loudly');
  // let closeLoudlyModal = document.querySelector('.loudly-close')
  // closeLoudlyModal.onclick = function () {
  //   loudlyModal.style.display = 'none'
  // }

  // ==================================================================
  // SPEECH PROCESSING AND TIMING
  // ==================================================================
  // Incremental function to run every X ms to keep track of who is talking
  let last_pulse = 0;
  function pulse() {
    let id, record, now = Date.now();
    let time_since_last_pulse = now - last_pulse;
    if (!last_pulse) {
      last_pulse = now;
      return;
    }
    last_pulse = now;
    try {
      // We need to loop over every participant who has ever talked
      for (id in data) {
        if (!data.hasOwnProperty(id)) { continue; }
        record = data[id];
        if (record.talking) {
          record.update_required = true;

          // If it's been more than 1s since they have talked, they are done
          if (now - record.last >= 1000) {
            record.talking = false;
            record.last_start = 0;
            // Mark them as not talking
            notTalking(record);
            continue;
          }
          let duration = (record.last - record.last_start);

          // If the person has been talking but not yet for at least one pulse_timeslice, don't do anything yet
          if (duration < config.pulse_timeslice) {
            continue;
          }

          // Update this person's time and total time with pulse timer duration
          record.total += time_since_last_pulse;
          totaltalktime += time_since_last_pulse;

          // Mark them as talking
          talking(record);

          // Flag the display as requiring an update
          update_display_required = true;
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  setInterval(pulse, config.pulse_timeslice);
  setInterval(() => {
    chrome.storage.local.get(["current_name"], function (storage) {
      let talkTimeContainer = document.querySelector('#talk-time-container')
      if (talkTimeContainer) {
        let percentages = document.querySelectorAll('.talk-time-table > tr')
        let percentObject = []
        percentages.forEach(percentage => {
          let name = percentage.querySelector('.talk-time-name').textContent
          let percent = percentage.querySelector('.talk-time-pct').textContent
          percentObject.push({
            name,
            percent
          })
        })
        fetch(`http://localhost:3000/percentage/${parsed_URL}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            percents: percentObject
          })
        })
      }
    })
  }, 5000)

  let apiInterval = setInterval(() => {
    chrome.storage.local.get(["current_name"], async function (storage) {
      await fetch('https://talk-time-server.herokuapp.com/')
        .then((response) => response.json())
        .then(async data => {
          let isMessagePresent = data.find(d => d.to === storage.current_name && d.url === parsed_URL)
          if (isMessagePresent) {
            chrome.storage.local.set({ message: isMessagePresent })
            let messageAlert = document.querySelector('.message-alert')
            if (messageAlert) {
              document.querySelector('.message-alert span').innerHTML = isMessagePresent.text;
              messageAlert.style.display = 'flex'
            }
            else {
              displayTalkToMuchMessage(isMessagePresent.text, isMessagePresent.from)
            }
          }
        })
    })
  }, 5000)

  setInterval(() => {
    let allNames = document.querySelectorAll('.zWGUib');
    let allImgUrls = document.querySelectorAll('.KjWwNd');
    let users = [];
    for (let i = 0; i < allNames.length; i++) {
      users.push({
        name: allNames[i].textContent,
        url: parsed_URL,
        img: allImgUrls[i].getAttribute('src')
      })
    }
    fetch(`https://talk-time-server.herokuapp.com/feedbacks/${parsed_URL}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Token': 'Bearer 580792'
      },
      body: JSON.stringify({
        users
      })
    })
  }, 5000)

  let qualityInterval = setInterval(() => {
    if (window.navigator.connection.downlink < 1.2 && window.navigator.connection.downlink > 0) {
      document.querySelector('.bad-internet-connection').style.display = 'flex'
      clearInterval(qualityInterval)
    }
  }, 5000)

  // ==================================================================
  // SPEECH DETECTION
  // ==================================================================
  // Watch for the talk icon to animate
  let observer = new MutationObserver(function (mutations) {
    try {
      let allPercents = document.querySelectorAll(".unique_pct_selector");
      let usersTalkingInformation = []
      allPercents.forEach(percent => {
        usersTalkingInformation.push({
          percents: convertPercentToNumber(percent.textContent),
          name: percent.previousElementSibling.previousElementSibling.textContent,
          button: percent.closest('tr').querySelector('button')
        })
      })

      let cancelButton = document.querySelector('.modal-cancel')
      let sendButton = document.querySelector('.modal-send')
      if (cancelButton && sendButton) {
        cancelButton.onclick = function () {
          document.querySelector('.modal').className = 'hidden modal'
        }
        sendButton.onclick = async function () {
          if (!document.querySelector('.modal-message').value.trim()) {
            document.querySelector('.modal-message').style.border = '1px solid tomato'
          }
          else {
            chrome.storage.local.get(["current_name"], async function (storageFirst) {
              chrome.storage.local.get(["to_name"], async function (storageSecond) {
                console.log(storageFirst.current_name, storageSecond.to_name)
                await fetch('https://talk-time-server.herokuapp.com/add', {
                  method: 'POST',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    text: document.querySelector('.modal-message').value.toString(),
                    from: storageFirst.current_name,
                    to: storageSecond.to_name,
                    url: parsed_URL
                  })
                })
              })
            });
            document.querySelector('.modal').className = 'hidden modal'
          }
        }
      }

      let openBadgeModalButtons = document.querySelectorAll('.give-badge-button')
      let badgeModal = document.querySelector('.badge-modal')
      let closeBadgeModal = document.querySelector('.close-badge-modal')
      openBadgeModalButtons.forEach(button => {
        button.onclick = function () {
          badgeModal.style.display = 'block'
          let attr = this.parentElement.getAttribute('data-name')
          chrome.storage.local.set({ "badge_name": attr })
        }
      })

      if (closeBadgeModal) {
        closeBadgeModal.onclick = function () {
          badgeModal.style.display = 'none'
        }
      }

      let badgesButtons = document.querySelectorAll('.badge-modal-body > button');
      badgesButtons.forEach(button => {
        button.onclick = function () {
          chrome.storage.local.get(["badge_name"], async function (storage) {
            let img = button.querySelector('img')
            let src = img.src.split('/').at(-1)
            fetch(`http://localhost:3000/givebadge/${storage.badge_name}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                badge: src
              })
            })
          })
        }
      })

      const allTr = document.querySelectorAll('tr[data-name]')
      if (allTr) {
        const nameList = {};

        allTr.forEach((item) => {
          const currentName = item.getAttribute("data-name");

          if (nameList[currentName] || !item.children[0].textContent.trim()) {
            item.remove();
          }
          else {
            nameList[currentName] = true;
          }

        });
      }

      const closeBadInternetModal = document.querySelector('.close-bad-internet-modal')
      const badInternetModal = document.querySelector('.bad-internet-connection')
      if (closeBadInternetModal) {
        closeBadInternetModal.onclick = function () {
          document.body.removeChild(badInternetModal)
        }
      }

      let allMeetingNames = document.querySelectorAll('.zWGUib');
      allMeetingNames.forEach(meetingName => {
        if (meetingName.nextElementSibling?.className === 'NnTWjc') {
          chrome.storage.local.set({ "current_name": meetingName.textContent })
        }
      })


      chrome.storage.local.get(["current_name"], async function (storage) {
        let vadLink = `http://localhost:3000/vad/${parsed_URL}/${storage.current_name}`
        let vadElement = document.querySelector('.vad-link');
        if (!vadElement) {
          let a = $el('a')
          a.className = 'vad-link'
          a.setAttribute('clicked', false)
          a.setAttribute('href', vadLink)
          a.setAttribute('target', '_blank')
          document.body.appendChild(a)
        }

        else {
          if (vadElement.getAttribute('clicked') === 'false') {
            vadElement.setAttribute('clicked', 'true')
            vadElement.click()
          }
        }
      })

      let messageAlert = document.querySelector('.message-alert');
      if (messageAlert) {
        document.querySelector('.close-message-alert').onclick = function () {
          chrome.storage.local.get(["current_name"], async function (storage) {
            await fetch('https://talk-time-server.herokuapp.com/', {
              method: 'DELETE',
              headers: {
                'Content-type': 'application/json'
              },
              body: JSON.stringify({
                name: storage.current_name,
                url: parsed_URL
              })
            })
          })
          messageAlert.style.display = 'none';
        }
      }

      chrome.storage.local.get(['current_name'], function (storage) {
        let allTr = document.querySelectorAll('.talk-time-table > tr')
        for (let i = 0; i < allTr.length; i++) {
          for (let j = 0; j < allTr[i].children.length; j++) {
            let child = allTr[i].children[j]
            if (child.className === 'talk-time-name') {
              if (child.textContent === storage.current_name) {
                allTr[i].querySelector('.send-message-button').disabled = true;
                // allTr[i].querySelector('.give-badge-button').disabled = true;
              }
            }
          }
        }
      })

      chrome.storage.local.get(['background'], function (storage) {
        const { background } = storage;
        const allSendMessageButtons = document.querySelectorAll('.send-message-button');
        allSendMessageButtons.forEach(button => {
          if (!button.disabled) {
            button.style.background = background;
            button.style.border = `1px solid ${background}`;
          }
        })
      })

      let names = [...usersTalkingInformation.map(user => user.name)];
      let buttons = [...usersTalkingInformation.map(user => user.button)];

      for (let i = 0; i < usersTalkingInformation.length; i++) {
        buttons[i].onclick = function () {
          chrome.storage.local.set({ "to_name": names[i] })
          chrome.storage.local.get(["to_name"], function (storage) {
            console.log(storage.to_name)
          })
          if (!document.querySelector('.modal')) {
            createSendMessageModal(names[i])
            document.querySelector('.modal').className = 'modal'
            document.querySelector('.modal-message').placeholder = `Your message here`
          }
          else {
            document.querySelector('.modal-title').innerHTML = `Do you want send message to the ${names[i]}?`
            document.querySelector('.modal').className = 'modal'
            document.querySelector('.modal-message').placeholder = `Your message here`
          }
        }

      }

      mutations.forEach(function (mutation) {
        let el = mutation.target;

        // Only act if there really was a change
        // I don't think I should have to do this, but here we are
        if (mutation.oldValue === el.className) { return; }

        // The element must be visible for it to count. When muted, the talk bars become hidden
        let display = getComputedStyle(el).getPropertyValue('display');
        if ("none" === display) {
          return;
        }

        // Make sure the participant has a data record and it's being tracked
        let id = el.getAttribute('talk-id');
        if (!id) {
          let listitem = parent(el, 'div[role="listitem"]');
          if (listitem) {
            id = listitem.getAttribute('data-participant-id');
            el.setAttribute('talk-id', id);
          }
        }

        // This is the first time this person has talked, add a timer for them
        let record = data[id];
        if (!record) {
          record = data[id] = init_participant(id, el);
        }

        const now = Date.now();
        if (!record.last_start) {
          record.last_start = now;
        }
        if (record.last < now) {
          record.last = now;
        }
        record.talking = true;


      });
    } catch (e) {
      console.log(e);
    }
  });


  // ==================================================================
  // ATTACH
  // ==================================================================
  let observerConfig = {
    attributes: true,
    attributeOldValue: true,
    attributeFilter: ['class'],
    subtree: true,
  };
  let attached = false;
  function attach() {
    if (attached) {
      if (!participants_list || !participants_list.parentNode) {
        dom_container.style.display = "none";
        observer.disconnect();
        attached = false;
      }
    }
    else {
      participants_list = document.querySelector(config.participants_selector);
      if (participants_list) {
        observer.observe(participants_list, observerConfig);
        if (dom_container) {
          dom_container.style.display = "block";
        }
        else {
          createContainer();
        }
        attached = true;
      }
    }
  }


  // ==================================================================
  // WELCOME MESSAGE
  // ==================================================================
  function welcome() {
    let d = $el('div', { id: "talk-time-welcome" });
    d.innerHTML = `
  <h1 class="talk-time-welcome-title">Welcome to Talk Time!</h1>
  <p>To enable the Talk Time display, turn on the Participants list while in a Meet.</p>
  <div class="group-welcome-instructions">Click on the
      <div class="talk-time-group-label welcome-groups-mark talk-time-group-selector-a">A</div>
      <div class="talk-time-group-label welcome-groups-mark talk-time-group-selector-b">B</div>
      <div class="talk-time-group-label welcome-groups-mark talk-time-group-selector-c">C</div>
      <div class="talk-time-group-label welcome-groups-mark talk-time-group-selector-d">D</div>
      grouping buttons to add participants to ad-hoc groups and total their time together. Click on the group labels
      below to rename them.
  </div>
  <div class="site-link">For more, visit <a href="https://EveryoneShouldHaveAVoice.com" target="_blank">EveryoneShouldHaveAVoice.com</a>
  </div>
  <div class="warning-respect-text">Don't forget that everyone should have a voice and that every question should not go unanswered! Respect each other</div>
  <div class="okay-wrapper">
      <button id="talk-time-welcome-okay">Okay</button>
  </div>
  `;
    document.body.appendChild(d);
    document.querySelector('#talk-time-welcome-okay').addEventListener('click', () => {
      options.welcome_dismissed = false;
      chrome.storage.local.set({ "options": options });
      d.style.display = "none";
    });
  }

  // Get options
  chrome.storage.local.get(['options'], function (storage) {
    options = storage.options;
    if (!options) {
      options = {
        "welcome_dismissed": false
      };
      chrome.storage.local.set({ "options": options });
    }
    if (!options.welcome_dismissed) {
      welcome()
    }

    setInterval(attach, 1000);
  });

  let convertPercentToNumber = percent => +percent.slice(0, -1)

  function displayTalkToMuchMessage(text, from) {
    let message = $el('div');
    message.className = 'message-alert';
    message.innerHTML = `
        <h1>A new message!</h1>
        <span>${text}</span>
        <span>from: ${from}</span>
        <button class="close-message-alert">Close</button>
      `
    message.style.display = 'flex'
    document.body.appendChild(message)
  }

}