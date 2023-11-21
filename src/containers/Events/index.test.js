import { act, fireEvent, render, screen } from "@testing-library/react";
import { api, DataProvider } from "../../contexts/DataContext";
import Events from "./index";

const data = {
  events: [
    {
      id: 1,
      type: "soirée entreprise",
      date: "2022-04-29T20:28:45.744Z",
      title: "Conférence #productCON",
      cover: "/images/stem-list-EVgsAbL51Rk-unsplash.png",
      description:
        "Présentation des outils analytics aux professionnels du secteur",
      nb_guesses: 1300,
      periode: "24-25-26 Février",
      prestations: [
        "1 espace d’exposition",
        "1 scéne principale",
        "2 espaces de restaurations",
        "1 site web dédié",
      ],
    },

    {
      id: 2,
      type: "forum",
      // Modification de la date pour éviter les dates similaires pour que le test passe
      date: "2022-05-29T20:28:45.744Z",
      title: "Forum #productCON",
      cover: "/images/stem-list-EVgsAbL51Rk-unsplash.png",
      description:
        "Présentation des outils analytics aux professionnels du secteur",
      nb_guesses: 1300,
      periode: "24-25-26 Février",
      prestations: ["1 espace d’exposition", "1 scéne principale"],
    },
  ],
};

describe("When Events is created", () => {
  it("a list of event card is displayed", async () => {
    api.loadData = jest.fn().mockReturnValue(data);
    // utilisation du composant act(async) pour wrapper les appels à api.loadData et
    // permettre que les appels asynchrones et les mises à jour d'état associées
    // soient correctement synchronisés avec React.
    await act(async () => {
      render(
        <DataProvider>
          <Events />
        </DataProvider>
      );
    });
    expect(await screen.findByText("avril"));
  });
});

describe("and an error occured", () => {
  it("an error message is displayed", async () => {
    window.console.error = jest.fn();
    api.loadData = null;
    jest.fn().mockRejectedValue("An error occured");

    await act(async () => {
      render(
        <DataProvider>
          <Events />
        </DataProvider>
      );
    });
    expect(await screen.findByText("An error occured")).toBeInTheDocument();
  });
});
describe("and we select a category", () => {
  // suppression de it.only qui permet d'ignorer un test, afin d'effectuer et valider chaque test.
  it("an filtered list is displayed", async () => {
    api.loadData = jest.fn().mockReturnValue(data);
    await act(async () => {
      render(
        <DataProvider>
          <Events />
        </DataProvider>
      );
    });
    await screen.findByText("Forum #productCON");
    fireEvent(
      await screen.findByTestId("collapse-button-testid"),
      new MouseEvent("click", {
        cancelable: true,
        bubbles: true,
      })
    );
    fireEvent(
      (await screen.findAllByText("soirée entreprise"))[0],
      new MouseEvent("click", {
        cancelable: true,
        bubbles: true,
      })
    );

    await screen.findByText("Conférence #productCON");
    expect(screen.queryByText("Forum #productCON")).not.toBeInTheDocument();
  });
});

describe("and we click on an event", () => {
  it("the event detail is displayed", async () => {
    api.loadData = jest.fn().mockReturnValue(data);
    await act(async () => {
      render(
        <DataProvider>
          <Events />
        </DataProvider>
      );
    });

    fireEvent(
      await screen.findByText("Conférence #productCON"),
      new MouseEvent("click", {
        cancelable: true,
        bubbles: true,
      })
    );

    await screen.findByText("24-25-26 Février");
    await screen.findByText("1 site web dédié");
  });
});
