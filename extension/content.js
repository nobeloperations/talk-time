window.onload = async function () {
  const { generateHTML, addTopicAndNotesItems, addTopicAndDashboardFlags, setOpenChatButton } = await import(chrome.runtime.getURL('./resources/html.js'))
  const { waitForElement, $el, dashboardAndTopicVisual, openTopicAndNotesModal, closeBadgesModal, openBadgesModal, sendBadge, createNote, closeNotesModal, closeTopicModal, setNewTopic, openChat, closeChat, openChatSpace, returnToMainChat, sendChatMessage, searchBadges } = await import(chrome.runtime.getURL('./resources/helper.functions.js'));
  const { setHost, setCurrentName } = await import(chrome.runtime.getURL('./resources/storage.functions.js'));
  const { sendMessageToHost, messageToHost, messageFromHost, messageBadge, messageTopic } = await import(chrome.runtime.getURL('./resources/message.functions.js'));
  const { addUserToChat, removeUserFromChat } = await import(chrome.runtime.getURL('./resources/chat.functions.js'));
  const { addUser } = await import(chrome.runtime.getURL('./resources/user.functions.js'));
  const { addMeeting } = await import(chrome.runtime.getURL('./resources/meeting.functions.js'));
  let badgeModalWrapper, badges, badgeSearchInput, notesModal, topicModal, topicInput, modalShadow, listOfMessageUsers, openChatButton, optionsWrapper;

  const parsed_URL = window.location.href.split('/').slice(-1).toString().slice(0, 12);
  const DASHBOARD_LINK = 'https://nobeltt.com/'
  const CHAT_LINK = 'https://adventurous-glorious-actor.glitch.me/stream-messages'
  // const DASHBOARD_LINK = 'http://localhost:3001/'
  const DATE = new Date().toISOString().split('T')[0]
  const body = document.querySelector('body');

  const event_source = new EventSource(CHAT_LINK);
  event_source.onmessage = async (event) => {
    const message = JSON.parse(event.data);

    const messageFunctions = {
      'BADGE': () => { messageBadge(message, DATE, parsed_URL) },
      'TOPIC': () => { messageTopic(message, DATE, parsed_URL) },
      'MESSAGE_FROM_HOST': () => { messageFromHost(message) },
      'MESSAGE_TO_HOST': () => { messageToHost(message) }
    }

    messageFunctions[message.type]()

  };

  (async () => {
    generateHTML(document.body)
  })()
    .then(() => {
      badgeModalWrapper = document.querySelector('.badge-modal-wrapper')
      badges = document.querySelectorAll('.badge-item')
      badgeSearchInput = document.querySelector('.badge-search')
      notesModal = document.querySelector('.notes-modal')
      topicModal = document.querySelector('.topic-modal')
      topicInput = document.querySelector('.topic-input')
      modalShadow = document.querySelector('.modal-shadow')
      listOfMessageUsers = document.querySelector('.message-list-wrapper')
    })
    .then(() => {
      let optionsObserver = new MutationObserver(async function (mutations) {
        for (mutation of mutations) {
          let [addedNodes] = mutation.addedNodes
          if (addedNodes?.className === 'pw1uU') {
            optionsWrapper = document.querySelector('ul[aria-label="Call options"')
            const addedWrapper = document.querySelector('.options-added-wrapper')

            if (optionsWrapper && !addedWrapper) {
              addTopicAndNotesItems(optionsWrapper)
              const openNotes = await waitForElement('.note-wrapper')
              openNotes.onclick = () => { openTopicAndNotesModal(modalShadow, notesModal, optionsWrapper) }
              const openTopic = await waitForElement('.topic-wrapper')
              openTopic.onclick = () => { openTopicAndNotesModal(modalShadow, topicModal, optionsWrapper) }
            }
          }
        }
      });

      optionsObserver.observe(document.body, { attributes: false, childList: true, characterData: false, subtree: true });

      (async function () {
        const listOfUsers = await waitForElement('.GvcuGe');
        await setCurrentName(listOfUsers.children)
        await setHost(listOfUsers.children)
        await setOpenChatButton()
          .then(() => {
            openChatButton = document.querySelector('.open-chat-button')
            openChatButton.style.display = 'flex'
          })
        addUser(listOfUsers.children, parsed_URL, DATE, DASHBOARD_LINK);
        addUserToChat(listOfUsers.children)

        const meetingName = (await waitForElement('.u6vdEc')).textContent.trim();
        addMeeting(meetingName, parsed_URL, DATE, DASHBOARD_LINK)

        let usersListObserver = new MutationObserver(function (mutations) {
          mutations.forEach(function (mutation) {
            if (mutation.addedNodes.length) {
              addUser(mutation.addedNodes, parsed_URL, DATE, DASHBOARD_LINK);
              addUserToChat(mutation.addedNodes)
            }
            else if (mutation.removedNodes.length) removeUserFromChat(mutation)
          });
        });

        let config = { attributes: true, childList: true, characterData: true };
        usersListObserver.observe(listOfUsers, config);
      })();

      (async function () {
        const meetingName = (await waitForElement('.ouH3xe')).textContent;
        addTopicAndDashboardFlags(parsed_URL, DATE, meetingName)
      })();

      (async function () {
        const closeBadgeModal = (await waitForElement('.close-badges-modal'))
        closeBadgeModal.onclick = () => { closeBadgesModal(modalShadow, badgeModalWrapper, badgeSearchInput, badges) }
      })();

      function closeMessageModal(e) {
        const modal = e.target.parentElement.parentElement;
        modalShadow.style.display = 'none'
        modal.style.display = 'none'
      }

      (async function () {
        const createNoteButton = await waitForElement('.add-note')
        createNoteButton.onclick = () => { createNote(modalShadow, DASHBOARD_LINK, parsed_URL, DATE, notesModal) }
      })();

      (async function () {
        const closeNoteModalButton = await waitForElement('.cancel-note')
        closeNoteModalButton.onclick = () => { closeNotesModal(modalShadow, notesModal) }
      })();

      (async function () {
        const closeTopicModalButton = await waitForElement('.close-topic-modal')
        closeTopicModalButton.onclick = () => { closeTopicModal(modalShadow, topicModal, topicInput) }
      })();

      (async function () {
        const setNewTopicButton = await waitForElement('.set-topic')
        setNewTopicButton.onclick = () => { setNewTopic(topicInput, parsed_URL, DATE, modalShadow, topicModal) }
      })();

      (async function() {
        const dashboardLink = await waitForElement('.dashboard-link-image')
        dashboardLink.onclick = () => {
          dashboardAndTopicVisual(dashboardLink, '.dashboard-link', 90)
        }
      })();

      (async function() {
        const dashboardLink = await waitForElement('.curr-topic-image')
        dashboardLink.onclick = () => {
          dashboardAndTopicVisual(dashboardLink, '.curr-topic', 100)
        }
      })();

      (async function() {
        const openMessageListButton = (await waitForElement('.open-chat-button'));
        openMessageListButton.onclick = () => { openChat(listOfMessageUsers, openChatButton) }
      })();

      (async function() {
        const closeChatButton = (await waitForElement('.close-chat-button'))
        closeChatButton.onclick = () => { closeChat(listOfMessageUsers, openChatButton) }
      })();

      (async function replyToHost() {
        const replyButton = await waitForElement('.reply-button')
        replyButton.onclick = () => { sendMessageToHost(parsed_URL) }
      })();

      (async function() {
        const searchBadgesInput = await waitForElement('.badge-search')
        searchBadgesInput.oninput = () => { searchBadges(searchBadgesInput, badges) }
      })();

      let percentageInterval = setInterval(() => {
        let talkTimeContainer = document.querySelector('#talk-time-container')
        if (talkTimeContainer) {
          let percentages = document.querySelectorAll('.talk-time-table > tr')
          let percentObject = {}
          percentages.forEach(percentage => {
            let name = percentage.querySelector('.talk-time-name').textContent
            let percent = percentage.querySelector('.talk-time-pct').textContent
            percentObject.name = name;
            percentObject.percent = percent;
          })
          fetch(`${DASHBOARD_LINK}percentage/${parsed_URL}/${DATE}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              percents: percentObject
            })
          })
        }
      }, 10000)

      body.onclick = function (e) {
        const options = {
          'close-message-alert': closeMessageModal,
          'close-badges-alert': closeMessageModal,
          'close-topic-alert': closeMessageModal,
          'open-badges-modal': () => { openBadgesModal(e, modalShadow, badgeModalWrapper) },
          'send-badge': () => { sendBadge(e, modalShadow, DASHBOARD_LINK, parsed_URL, DATE, badgeModalWrapper) },
          'chat-user-avatar': openChatSpace,
          'chat-user-name': openChatSpace,
          'chat-user': openChatSpace,
          'chat-space-button': () => { sendChatMessage(e, parsed_URL) },
          'chat-space-arrow-back': () => { returnToMainChat(e, openChatButton) }
        }
        options?.[e.target.className]?.(e)
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
        </div>
        <div class="talk-time-header">
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
        row.className = 'talk-time-user-wrapper'
        row.innerHTML = `
            <td class="talk-time-name">${record.name}</td>
            <td class="talk-time-time">0:00</td>
            <td class="talk-time-pct unique_pct_selector">0%</td>
            <button class="open-badges-modal">Give Badge</button>
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

      // ==================================================================
      // SPEECH DETECTION
      // ==================================================================
      // Watch for the talk icon to animate
      let observer = new MutationObserver(function (mutations) {

        try {
          const allTr = document.querySelectorAll('.talk-time-table > tr')
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

          chrome.storage.local.get(['current_name'], function (storage) {
            let allTr = document.querySelectorAll('.talk-time-table > tr')
            allTr.forEach(tr => {
              if (tr.dataset.name === storage.current_name) {
                tr.querySelector('.open-badges-modal').disabled = true
              }
            })
          })

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

    })

}