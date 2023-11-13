import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import Field, { FIELD_TYPES } from "../../components/Field";
import Select from "../../components/Select";
import Button, { BUTTON_TYPES } from "../../components/Button";

const mockContactApi = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 900);
  });

const Form = ({ onSuccess, onError }) => {
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState({});
  const sendContact = useCallback(
    async (evt) => {
      evt.preventDefault();
      setSending(true);
      setErrors({});
      // We try to call mockContactApi
      try {
        await mockContactApi();
        setSending(false);
        evt.target.reset();
        // Appel de la fonction onSuccess() pour afficher le message de confirmation
        onSuccess();
      } catch (err) {
        setSending(false);
        onError(err);
      }
    },
    [onSuccess, onError]
  );
  return (
    <form onSubmit={sendContact}>
      <div className="row">
        <div className="col">
          <Field placeholder="" label="Nom" />
          {errors.nom && <div className="error-message">{errors.nom}</div>}
          <Field name="prenom" placeholder="" label="Prénom" />
          {errors.prenom && (
            <div className="error-message">{errors.prenom}</div>
          )}
          <Select
            selection={["Personel", "Entreprise"]}
            onChange={() => null}
            label="Personel / Entreprise"
            type="large"
            titleEmpty
          />
          <Field name="email" placeholder="" label="Email" />
          {errors.email && <div className="error-message">{errors.email}</div>}
          <Button
            type={BUTTON_TYPES.SUBMIT}
            data-testid="button-test-id"
            disabled={sending}
          >
            {sending ? "En cours" : "Envoyer"}
          </Button>
        </div>
        <div className="col">
          <Field
            name="message"
            placeholder="message"
            label="Message"
            type={FIELD_TYPES.TEXTAREA}
          />
          {errors.message && (
            <div className="error-message">{errors.message}</div>
          )}
        </div>
      </div>
    </form>
  );
};

Form.propTypes = {
  onError: PropTypes.func,
  onSuccess: PropTypes.func,
};

Form.defaultProps = {
  onError: () => null,
  onSuccess: () => null,
};

export default Form;
