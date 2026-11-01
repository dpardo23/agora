import { render, screen } from "@testing-library/react";
import Inicio from "./page";

describe("página provisional", () => {
  it("muestra un único título de nivel 1", () => {
    render(<Inicio />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("En construcción");
  });
});
