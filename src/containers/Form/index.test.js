import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Form from "./index";

describe("When Events is created", () => {
  it("a list of event card is displayed", async () => {
    render(<Form />);
    await screen.findByText("Email");
    await screen.findByText("Nom");
    await screen.findByText("Prénom");
    await screen.findByText("Personel / Entreprise");
    await screen.findByTestId("button-test-id");
    await screen.findByText("Envoyer");
  });

  describe("and a click is triggered on the submit button", () => {
    it("the success action is called", async () => {
      const onSuccess = jest.fn();
      render(<Form onSuccess={onSuccess} />);
      fireEvent(
        await screen.findByTestId("button-test-id"),
        new MouseEvent("click", {
          cancelable: true,
          bubbles: true,
        })
      );
      // Après le click, on attend que le texte "En cours" apparaisse
      await screen.findByText("En cours");
      // Le texte "Envoyer" ne doit plus être visible
      expect(screen.queryByText("Envoyer")).toBeNull();
      // Attend que le texte "Envoyer" réapparaisse après l'envoi du formulaire.
      await waitFor(() => {
        expect(screen.queryByText("En cours")).toBeNull();
        expect(screen.queryByText("Envoyer")).not.toBeNull();
      });

      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
