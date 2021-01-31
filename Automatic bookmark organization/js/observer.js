async function loop() {
	while (true) {
		await wait();
		await observer();
	}
}

function wait() {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve();
		}, sleepSec * 1000);
	})
}

async function observer() {
	if (!isProcessing && (processList.length > 0)) {
		isProcessing = true;

		await getLocalStorage()
		while (processList.length > 0) {
			console.log('判定開始');
			await classifier(processList.shift());
			console.log('判定終了');
		}
		await replaceLocalStorage();
	}
	else if (isProcessing) {

		await getLocalStorage();

		// ブックマークの整理処理 TODO リファクタリング
		console.log('ブックマークの整理開始');
		await sortBookmarks();
		isProcessing = false;
		console.log('ブックマークの整理終了');

		await replaceLocalStorage();
	} else {
		console.log('イベントなし at ' + new Date() + '.');
	}
};

async function classifier(param) {
	switch (param[0]) {
		case typeInitialize:
			await initialize();
			break;
		case typeOnCreated:
			insertDbByCreatedBookmark(param[2]);
			break;
		case typeOnRemoved:
			removeDbRemovedBookmark(param[2]);
			break;
		case typeOnMoved:
			moveDbByMovedBookmark(param[1], param[2]);
			break;
		case typeOnVisited:
			countupViewsOfDbByUrl(param[1]);
			break;

		default:
	}
};

async function replaceLocalStorage() {
	await clearLocalStorage();
	await setLocalStorage();
};

function clearLocalStorage() {
	return new Promise((resolve, reject) => {
		chrome.storage.local.clear(() => {
			console.log('clear local storage.');
			resolve();
		});
	});
};

function setLocalStorage() {
	return new Promise((resolve, reject) => {
		chrome.storage.local.set({ key: node }, () => {
			console.log('set local storage.');
			resolve();
		});
	});
};

function getLocalStorage() {
	return new Promise((resolve, reject) => {
		chrome.storage.local.get(key, (value) => {
			node = value[key];
			console.log('get local storage.');
			resolve();
		});
	});
}
