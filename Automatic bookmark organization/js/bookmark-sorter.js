// TODO function名が、sortbookmarksとsortbookmarkでややこしい
async function sortBookmarks() {
    let nodeAndViews = folderViewsSumByBookmarkViews(node);
    node = nodeAndViews.node;
    node = sortIndexToAllNode(node);
    await sortAllBookmarks(node);
    await getLocalStorage();
};

function sortIndexToAllNode(tmpNode) {
    if (tmpNode.children) {
        let childrenNode = tmpNode.children;
        childrenNode = sortIndex(childrenNode);
        for (let i in childrenNode) { childrenNode[i] = sortIndexToAllNode(childrenNode[i]); };
        tmpNode.children = childrenNode;
    } else if (tmpNode.url) { };
    return tmpNode;
};

function sortIndex(tmpNode) {
    // sort
    tmpNode.sort((a, b) => {
        // is folder(asc)
        {
            let aIsFolder = 0; // a is folder = 0, a is not folder = 1.
            if (a.url) { aIsFolder = 1; };
            let bIsFolder = 0; // b is folder = 0, a is not folder = 1.
            if (b.url) { bIsFolder = 1; };
            if (aIsFolder < bIsFolder) return -1;
            if (aIsFolder > bIsFolder) return 1;
        }
        // views(desc)
        {
            if (a.views > b.views) return -1;
            if (a.views < b.views) return 1;
        }
        // title(asc)
        {
            if (a.title.toUpperCase() < b.title.toUpperCase()) return -1;
            if (a.title.toUpperCase() > b.title.toUpperCase()) return 1;
        }
        // url(asc)
        {
            if (a.url < b.url) return -1;
            if (a.url > b.url) return 1;
        }
        // id(asc)
        {
            if (a.id < b.id) return -1;
            if (a.id > b.id) return 1;
        }
        return 0;
    });
    // 順番通りにindexをソートする
    for (var i in tmpNode) {
        tmpNode[i]['index'] = Number(i);
    };
    return tmpNode;
};

async function sortAllBookmarks(tmpNode) {
    let nodeId = tmpNode.id;
    if (!(nodeId == 1 || nodeId == 2 || nodeId == 3)) { await sortBookmark(tmpNode); }
    if (tmpNode.children) {
        let childrenNode = tmpNode.children;
        for (let i in childrenNode) {
            childrenNode[i] = sortAllBookmarks(childrenNode[i]);
        };
        tmpNode.children = childrenNode;
    };
    return tmpNode;
};

async function sortBookmark(tmpNode) {
    let id = tmpNode['id'];
    let destination = { parentId: tmpNode['parentId'], index: tmpNode['index'] };
    if (destination.parentId != undefined && destination.parentId != undefined) {
        // TODO 下記のカウントアップがいるのか確認する。
        bookmarkMoveWaitCount = bookmarkMoveWaitCount + 1;
        await moveBookmarks(id, destination);
    };
};

function moveBookmarks(id, destination) {
    return new Promise((resolve, reject) => {
        chrome.bookmarks.move(id, destination, () => {
            // TODO 下記のカウントアップがいるのか確認する。
            bookmarkMoveWaitCount = bookmarkMoveWaitCount - 1;
            resolve();
        });
    });
};

function folderViewsSumByBookmarkViews(tmpNode) {
    let nodeAndViews = {
        node: node,
        views: 0
    };
    if (tmpNode.children) {
        let childrenNode = tmpNode.children;
        let folderViews = 0;
        for (let i in childrenNode) {
            nodeAndViews = folderViewsSumByBookmarkViews(childrenNode[i]);
            childrenNode[i] = nodeAndViews.node;
            folderViews = folderViews + nodeAndViews.views;
        };
        tmpNode.children = childrenNode;
        tmpNode.views = folderViews;
    }
    nodeAndViews.views = tmpNode.views;
    nodeAndViews.node = tmpNode;
    return nodeAndViews;
};