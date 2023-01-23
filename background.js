chrome.alarms.create("promodoroTimer", {
    periodInMinutes: 1 / 60,
})

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "promodoroTimer") {
        chrome.storage.local.get(["timer", "timeOption", "isRunning"], (res) => {
            if (res.isRunning) {
                let timer = res.timer + 1;
                let isRunning = true;
                if (timer === 60 * res.timeOption) {
                    this.registration.showNotification("Promodoro Timer", {
                        body: `${res.timeOption} Minutes has passed!`,
                        icon: "icon.png",
                    })
                    timer = 0;
                    isRunning = false
                }
                chrome.storage.local.set({
                    timer,
                    isRunning,
                })
            }
        })
    }
})

chrome.storage.local.get(["timer", "timeOption", "isRunning"], (res) => {
    chrome.storage.local.set({
        timer: "timer" in res ? res.timer : 0,
        timeOption: "timeOption" in res ? res.timeOption : 90,
        isRunning: "isRunning" in res ? res.isRunning : false,
    })
})