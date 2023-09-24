import Dialog, {
    DialogAction,
    DialogActions,
    DialogContent,
    DialogHeader,
    DialogHeadline,
} from '../../../components/Dialog';
import PropTypes from 'prop-types';

/** Dialog used to create a post */
export default function ConfirmDialog({
    close, open, onAccept,
}) {
    return <Dialog
        label="Confirmer l'annulation"
        onClose={close}
        open={open}
    >
        <DialogHeader>
            <DialogHeadline>Confirmer l'annulation?</DialogHeadline>
        </DialogHeader>

        <DialogContent>
            <p>Voulez-vous annuler la création du post?</p>
        </DialogContent>

        <DialogActions>
            <DialogAction onClick={close}>Non, revenir à la création</DialogAction>
            <DialogAction onClick={onAccept}>Oui, annuler</DialogAction>
        </DialogActions>
    </Dialog>;
}

ConfirmDialog.defaultProps = {
    open: false,
};

ConfirmDialog.propTypes = {
    /* Weither the dialog is visible or not */
    open: PropTypes.bool,

    /* Function to close the dialog, executed when the user cancels its choice or when the dialog is closed, required */
    close: PropTypes.func.isRequired,

    /* Function to execute when the user confirms its choice, required */
    onAccept: PropTypes.func.isRequired,
};