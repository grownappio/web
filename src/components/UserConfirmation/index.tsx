import { Confirm } from "../_utils/Confirm";

const UserConfirmation = async (payload: any, callback: any) => {
  const { action, curHref, message } = JSON.parse(payload);

  await Confirm({
    title: 'Discard changes',
    content: message,
    confirm: 'Discard',
    onCancel() {
      if (action === "POP") {
        window.location.hash = curHref;
      }
    }
  })

  callback(true)
};
export default UserConfirmation;
