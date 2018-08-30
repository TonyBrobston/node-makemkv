import io from 'socket.io-client';

const socket = io();

const waitForSocket = (callback, ...args) => {
    console.debug('Waiting for socket to become available.');

    if (socket.id) {
        console.debug('Socket is available.');

        return callback(...args);
    }

    setTimeout(waitForSocket, 1000, callback, ...args);
};

const subscribeTo = (eventName, callback, context, sendData) => {
    console.debug(`Subscribing to "${eventName}".`);
    waitForSocket(() => {
        socket.on(
            eventName,
            context ? callback.bind(context) : callback
        );
        socket.emit(`subscribeTo${eventName}`, sendData);
    });
};

const doAction = (actionName, sendData) => {
    console.debug(`Performing action "${actionName}".`);
    waitForSocket(() => {
        socket.emit(`do${actionName}`, sendData);
    });
};

// Listen for updates to disc-level information on a drive.
const subscribeToDiscInfo = (callback, context, driveId) => {
    subscribeTo('DiscInfo', callback, context, {driveId});
};

// Listen for updates to any drive-level information.
const subscribeToDriveInfo = (callback, context) => {
    subscribeTo('DriveInfo', callback, context);
};

// Start ripping tracks on a drive.
const actionRipTracks = (discName, driveId, trackIds) => {
    doAction('RipTracks', {
        discName,
        driveId,
        trackIds
    });
};

// Command server to get disc information for a drive.
const actionDiscInfo = (driveId) => {
    doAction('DiscInfo', {driveId});
};

export {
    actionDiscInfo,
    actionRipTracks,
    subscribeToDiscInfo,
    subscribeToDriveInfo
};
