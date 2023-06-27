
window.onload = async function () {

  let tagsAdded = []

  let badgeModalWrapper, messageAlert, badges, badgeSearchInput, messageInput, sendMessageModal, badInternetModal, notesModal, tags, noTagsSpan, topicModal, topicInput, optionButtonsMarkUp, modalShadow;

  const parsed_URL = window.location.href.split('/').slice(-1).toString().slice(0, 12);
  const LINK = 'https://nobeltt.com/'
  const DATE = new Date().toISOString().split('T')[0]
  const body = document.querySelector('body');

  const eventSource = new EventSource('https://adventurous-glorious-actor.glitch.me/stream-messages');
  eventSource.onmessage = (event) => {
    const message = JSON.parse(event.data);
    const messageModal = document.querySelector('.message-alert')
    const modalShadow = document.querySelector('.modal-shadow')
    const messageAvatar = document.querySelector('.message-avatar')
    const messageElem = messageModal.querySelector('.message')
    const messageFrom = messageModal.querySelector('.message-from')
    messageElem.innerHTML = message.message
    chrome.storage.local.get(["current_name"], function (storageFirst) {
      if (message.type === 'CHAT') {
        if (message.to === storageFirst.current_name && message.url === parsed_URL) {
          fetch(`${LINK}users/${message.name}`)
            .then(res => res.json())
            .then(response => {
              messageAvatar.src = response.avatar
              modalShadow.style.display = 'flex'
              messageFrom.innerHTML = message.name
              messageModal.style.display = 'flex'
            })
        }
      }
      else if (message.type === 'TOPIC') {
        if (message.url === parsed_URL && message.date === DATE) {
          messageFrom.innerHTML = 'Topic change'
          messageModal.style.display = 'flex'
          modalShadow.style.display = 'flex'
          const currTopic = document.querySelector('.curr-topic')
          currTopic.innerHTML = message.message;

        }
      }
      else if (message.type === 'BADGE') {
        if (message.url === parsed_URL && message.date === DATE && storageFirst.current_name === message.to) {
          messageFrom.innerHTML = 'New badge!'
          messageModal.style.display = 'flex'
          modalShadow.style.display = 'flex'
        }
      }
    })
  };

  (async () => {
    const { createBadgesModal, createSendMessageModal, createBadInternetModal, createMessageModal, createNotesModal, createTopicModal, optionButtons, createShadowModal } = await import(chrome.runtime.getURL('./resources/html.js'));
    const badInternetModalImage = chrome.runtime.getURL("./resources/warning.png")
    createBadgesModal(document.body);
    createSendMessageModal(document.body);
    createBadInternetModal(document.body, badInternetModalImage);
    createMessageModal(document.body);
    createNotesModal(document.body);
    createTopicModal(document.body);
    createShadowModal(document.body);
    optionButtonsMarkUp = optionButtons
  })()
    .then(() => {
      badgeModalWrapper = document.querySelector('.badge-modal-wrapper')
      messageInput = document.querySelector('.badge-search')
      badges = document.querySelectorAll('.badge-item')
      badgeSearchInput = document.querySelector('.badge-search')
      sendMessageModal = document.querySelector('.send-message-modal')
      messageInput = document.querySelector('.modal-message')
      badInternetModal = document.querySelector('.bad-internet-connection')
      messageAlert = document.querySelector('.message-alert')
      notesModal = document.querySelector('.notes-modal')
      tags = document.querySelector('.tags')
      topicModal = document.querySelector('.topic-modal')
      topicInput = document.querySelector('.topic-input')
      noTagsSpan = document.querySelector('.no-tags')
      modalShadow = document.querySelector('.modal-shadow')
    })
    .then(() => {
      function addUser(arr) {
        Array.from(arr).forEach(user => {
          const userInfo = user.querySelector('.SKWIhd')
          const userAvatar = userInfo.querySelector('.BEaVse > img')
          const userName = userInfo.querySelector('.zSX24d > .jKwXVe > .zWGUib')
          console.log(1)

          fetch(`${LINK}users/create/${parsed_URL}/${DATE}`, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Token': 'Bearer 580792'
            },
            body: JSON.stringify({
              name: userName.textContent,
              avatar: userAvatar.src,
              date: DATE
            })
          })
        })
      }

      let optionsObserver = new MutationObserver(function (mutations) {
        for (mutation of mutations) {
          if (mutation.addedNodes[0]?.className === 'pw1uU') {
            const optionsWrapper = document.querySelector('ul[aria-label="Call options"')
            const addedWrapper = document.querySelector('.options-added-wrapper')

            if (optionsWrapper && !addedWrapper) {
              const addedWrapperEl = document.createElement('div')
              addedWrapperEl.className = 'options-added-wrapper'
              addedWrapperEl.innerHTML = optionButtonsMarkUp

              optionsWrapper.prepend(addedWrapperEl)
              const topicWrapper = document.querySelector('.topic-wrapper')
              const noteWrapper = document.querySelector('.note-wrapper')

              topicWrapper.onclick = function () {
                modalShadow.style.display = 'flex'
                topicModal.style.display = 'flex'
                optionsWrapper.style.display = 'none'
              }

              noteWrapper.onclick = function () {
                modalShadow.style.display = 'flex'
                notesModal.style.display = 'block'
                optionsWrapper.style.display = 'none'
              }

            }
          }
        }
      });

      optionsObserver.observe(document.body, { attributes: false, childList: true, characterData: false, subtree: true });

      const usersInterval = setInterval(() => {
        const listOfUsers = document.querySelector('.GvcuGe')
        if (listOfUsers) {
          Array.from(listOfUsers.children).forEach(user => {
            const username = user.querySelector('.zWGUib')
            if (username?.nextElementSibling?.textContent === '(You)') {
              chrome.storage.local.set({ "current_name": username.textContent.trim() })
            }
          })
          clearInterval(usersInterval)

          const meetingName = document.querySelector('.u6vdEc').textContent
          if (meetingName !== 'Ready to join?' && meetingName.trim() !== '' && meetingName !== 'Meeting details') {
            fetch(`${LINK}main/addmeeting`, {
              method: "POST",
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                name: meetingName,
                url: parsed_URL,
                date: DATE
              })
            })
          }

          let usersListObserver = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
              if (mutation.addedNodes.length) {
                addUser(mutation.addedNodes)
              }
            });
          });

          let config = { attributes: true, childList: true, characterData: true }
          usersListObserver.observe(listOfUsers, config);
          addUser(listOfUsers.children)
        }
      }, 2500)

      let meetingNameInterval = setInterval(() => {
        const indicator = document.querySelector('.talk-time-user-wrapper')
        if (indicator) {
          let meetingName = document.querySelector('.ouH3xe')
          let dashboardLink = document.createElement('div')
          dashboardLink.className = 'dashboard-link-wrapper'
          dashboardLink.innerHTML = `
            <img class="dashboard-link-image" data-linkactive="" src="https://cdn-icons-png.flaticon.com/128/4050/4050374.png"/>
            <a class="dashboard-link" href="https://nobeltt.com/dashboard/${parsed_URL}/${DATE}?q=${meetingName.textContent}">Visit dashboard</a>
          `
          document.body.appendChild(dashboardLink)

          let topicWrapper = document.createElement('div')
          topicWrapper.className = 'curr-topic-wrapper'
          topicWrapper.innerHTML = `
            <img class="curr-topic-image" data-topicactive="" src="https://cdn-icons-png.flaticon.com/128/4886/4886806.png"/>
            <span class="curr-topic">No topic yet</span>
          `
          document.body.appendChild(topicWrapper)
          clearInterval(meetingNameInterval)
        }
      }, 2000)

      function $el(tag, props) {
        let p, el = document.createElement(tag);
        if (props) {
          for (p in props) {
            el[p] = props[p];
          }
        }
        return el;
      }


      function closeBadgesModal() {
        modalShadow.style.display = 'none'
        badgeModalWrapper.style.display = 'none'
        badgeSearchInput.value = ''
        badges.forEach(badge => {
          badge.style.display = 'flex'
        })
      }

      function openBadgesModal(e) {
        modalShadow.style.display = 'flex'
        badgeModalWrapper.style.display = 'flex'
        let attr = e.target.parentElement.getAttribute('data-name')
        chrome.storage.local.set({ "badge_name": attr })
      }

      function closeMessageModal() {
        messageAlert.style.display = 'none'
        modalShadow.style.display = 'none'
      }

      function sendMessage() {
        const messageValue = messageInput.value;
        if (messageValue.trim()) {
          modalShadow.style.display = 'none'
          chrome.storage.local.get(["current_name"], function (storageFirst) {
            chrome.storage.local.get(["to_name"], async function (storageSecond) {
              fetch('https://adventurous-glorious-actor.glitch.me/send-messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: storageFirst.current_name, url: parsed_URL, message: messageValue, to: storageSecond.to_name, type: "CHAT" })
              })
            })
            messageInput.value = ''
          });
          sendMessageModal.style.display = 'none'
        }
      }

      function closeSendMessageModal() {
        modalShadow.style.display = 'none'
        sendMessageModal.style.display = 'none'
        messageInput.value = ''
      }

      function giveBadge(e) {
        modalShadow.style.display = 'none'
        chrome.storage.local.get(['current_name'], async function (storageFirst) {
          chrome.storage.local.get(["badge_name"], async function (storage) {
            let src = e.target.parentElement.dataset.badge
            let badgeName = e.target.previousElementSibling.querySelector('span').textContent

            fetch(`${LINK}badges/givebadge/${parsed_URL}/${storage.badge_name}/${DATE}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                badge: src,
              })
            })
              .then(() => {
                fetch('https://adventurous-glorious-actor.glitch.me/send-messages', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ title: 'New badge!', url: parsed_URL, date: DATE, message: `You received ${badgeName} badge from ${storageFirst.current_name}!`, to: storage.badge_name, type: "BADGE" })
                })
              })
            badgeModalWrapper.style.display = 'none'
          })
        })
      }

      function closeBadInternetModal() {
        body.removeChild(badInternetModal)
      }

      function openSendMessageModal(e) {
        modalShadow.style.display = 'flex'
        const name = e.target.parentElement.dataset.name
        chrome.storage.local.set({ "to_name": name })
        document.querySelector('.modal-message').placeholder = `Send message to ${name}?`
        sendMessageModal.style.display = 'flex'
      }

      function createNote() {
        modalShadow.style.display = 'none'
        let note = document.querySelector('.note')
        let tagElements = document.querySelectorAll('.tag')
        if (note.value) {
          fetch(`${LINK}newconclusion/${parsed_URL}/${DATE}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              text: note.value,
              url: parsed_URL,
              tags: tagsAdded
            })
          })
            .then(() => {
              notesModal.style.display = 'none'
              tagElements.forEach(tagElement => {
                tags.removeChild(tagElement)
              })
              noTagsSpan.style.display = 'flex'
            })
        }

      }

      function addTag() {
        let tagsInput = document.querySelector('.tags-input')
        const tagValue = tagsInput.value
        if (tagValue.trim()) {
          tags.style.height = 'fit-content'
          let tag = document.createElement('div')
          tag.className = 'tag'
          tag.innerHTML = `× ${tagValue}`
          tags.appendChild(tag)
          noTagsSpan.style.display = 'none'
          tagsAdded.push(tagValue)
          tagsInput.value = ''
        }
      }

      function deleteTag(e) {
        tags.removeChild(e.target)
        if (tags.children.length === 1) {
          noTagsSpan.style.display = 'flex'
        }
        tagsAdded = tagsAdded.filter(tag => tag != e.target.textContent.slice(2))
      }

      function closeNoteModal() {
        modalShadow.style.display = 'none'
        let tagsInput = document.querySelector('.tags-input')
        let noteInput = document.querySelector('.note')
        notesModal.style.display = 'none'
        tagsInput.value = ''
        noteInput.value = ''

      }

      function closeTopicModal() {
        modalShadow.style.display = 'none'
        topicModal.style.display = 'none'
        topicInput.value = ''
      }

      async function setNewTopic() {
        const topicValue = topicInput.value;
        fetch('https://adventurous-glorious-actor.glitch.me/send-messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: parsed_URL, date: DATE, message: `Current topic of the meeting: ${topicValue}`, to: 'everyone', type: "TOPIC" })
        })

        modalShadow.style.display = 'none'
        topicModal.style.display = 'none'
        topicInput.value = ''
      }

      function visualOptions(e, selector, topValue) {
        const wrapper = document.querySelector(selector);
        const button = e.target;
        const attr = button.dataset.active;
        button.dataset.active = attr ? '' : 'true';
        button.style.transform = attr ? `rotate(360deg)` : `rotate(-360deg)`;
        wrapper.style.top = attr ? `-${topValue}px` : '0';
      }

      body.onclick = function (e) {
        const options = {
          'send-badge': giveBadge,
          'close-message-alert': closeMessageModal,
          'give-badge-button': openBadgesModal,
          'close-badge-modal': closeBadgesModal,
          'modal-send': sendMessage,
          'close-message-modal': closeSendMessageModal,
          'close-bad-internet-modal': closeBadInternetModal,
          'send-message-button': openSendMessageModal,
          'cancel-note': closeNoteModal,
          'add-note': createNote,
          'add-tag': addTag,
          'tag': deleteTag,
          'close-topic-modal': closeTopicModal,
          'set-topic': setNewTopic,
          'dashboard-link-image': () => {visualOptions(e, '.dashboard-link', 90)},
          'curr-topic-image': () => {visualOptions(e, '.curr-topic', 50)}
        }
        options?.[e.target.className]?.(e)
      }

      body.oninput = function (e) {
        if (e.target.className === 'badge-search') {
          let value = e.target.value.toLowerCase()
          badges.forEach(badge => {
            let badgeName = badge.querySelector('.span-wrapper > span')
            if (!badgeName.textContent.toLowerCase().includes(value) && value) {
              badge.style.display = 'none'
            }
            else {
              badge.style.display = 'flex'
            }
          })
        }
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
      setInterval(() => {
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
          fetch(`${LINK}percentage/${parsed_URL}/${DATE}`, {
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

      // ==================================================================
      // SPEECH DETECTION
      // ==================================================================
      // Watch for the talk icon to animate
      let observer = new MutationObserver(function (mutations) {

        if (window.navigator.connection.downlink < 1.2 && window.navigator.connection.downlink > 0) {
          let badInternetConn = document.querySelector('.bad-internet-connection')
          if (badInternetConn) {

            document.querySelector('.bad-internet-connection').style.display = 'flex'
          }
        }

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
                tr.querySelector('.send-message-button').disabled = true
                tr.querySelector('.give-badge-button').disabled = true
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