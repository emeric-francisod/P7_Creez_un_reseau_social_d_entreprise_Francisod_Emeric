import { useState } from 'react';
import { ACTIONS, isUserUpdated } from './formReducer.js';
import { useUpdateUserRoleForm } from './useUpdateUserRoleForm.js';

/**
 * Hook handling form validation, submission and request errors for the post creation form
 * @param {Function} setIsOpen - Function to open or close the dialog
 * @param {{userId: number, roleId: number}} [user]
 * @returns {
 *  isLoading,
 *  data,
 *  dispatch,
 *  dialogActions: {
 *      confirm,
 *      save,
 *  },
 * }
 */
export function useUpdateUserRoleDialog(setIsOpen, user) {
    // Mutation data. When the mutation is successful, close the form
    function onSuccess() {
        setIsOpen(false);
    }
    const {
        isLoading,
        mutate,
        dispatch,
        data,
    } = useUpdateUserRoleForm(onSuccess, user);

    /*
     * Cancels the input.
     * Closes the dialog and reset the form
     */
    function cancel() {
        dispatch({ type: ACTIONS.reset });
        setIsOpen(false);
    }

    /* Saves the form */
    function save() {
        mutate();
    }

    return {
        isLoading,
        data,
        dispatch,
        dialogActions: {
            cancel,
            save,
        },
    };
}