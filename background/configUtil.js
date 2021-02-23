function setConfiguration(value) {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.sync.set(value, function () {
                resolve();
            });
        } catch {
            chrome.storage.local.set(value, function () {
                resolve();
            });
        }
    });
}

async function toReflectConfig() {
    let configuration = await getConfiguration();
    term = configuration.term;
    decreasePercentage = configuration.decreasePercentage;
    sortOrder = configuration.sortOrder;
}


function getConfiguration() {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.sync.get([conf_key], function (result) {
                if (result.configuration) {
                    resolve(result.configuration);
                } else {
                    resolve(getDefaults());
                }
            });
        } catch {
            try {
                chrome.storage.local.get([conf_key], function (result) {
                    if (result.configuration) {
                        resolve(result.configuration);
                    } else {
                        resolve(getDefaults());
                    }
                });
            } catch {
                resolve(getDefaults());
            }
        }
    });
}

function getDefaults() {
    let configuration = { term: null, decreasePercentage: null };
    for (let i = 0; i < termSelections.length; i++) {
        if (termSelections[i].default) {
            configuration.term = termSelections[i].value.toString();
            break;
        }
    }

    for (let i = 0; i < decreasePercentageSelections.length; i++) {
        if (decreasePercentageSelections[i].default) {
            configuration.decreasePercentage = decreasePercentageSelections[i].value.toString();
            break;
        }
    }

    return configuration;
}