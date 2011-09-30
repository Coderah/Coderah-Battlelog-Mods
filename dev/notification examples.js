//GAME MANAGER - launcher (bottom left) messages/notifications
gamemanager.showLoaderWarning("warning") //warning message
gamemanager.showLoaderError("error") //warning message

//RECEIPT - left side of battlelog (fade after set time)
base.showReceipt("message here", receiptTypes.OK, 5000);

//UserMessageBox - Floating top
UserMessageBox.showTop("message here", UserMessageBox.MSG_INFORMATION);
//MSG_ERROR, MSG_INFORMATION, MSG_SUCCESS, MSG_WARNING
