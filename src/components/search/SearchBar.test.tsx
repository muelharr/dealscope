import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@/testing/test-utils";
import { SearchBar } from "./SearchBar";

describe("SearchBar Component", () => {
  it("renders with default placeholder and initial value", () => {
    render(<SearchBar defaultValue="MacBook" />);
    const input = screen.getByRole("textbox", { name: /search inputs/i }) as HTMLInputElement;

    expect(input).toBeInTheDocument();
    expect(input.value).toBe("MacBook");
  });

  it("handles input change", () => {
    render(<SearchBar />);
    const input = screen.getByRole("textbox", { name: /search inputs/i }) as HTMLInputElement;

    fireEvent.change(input, { target: { value: "RTX 5070" } });
    expect(input.value).toBe("RTX 5070");
  });

  it("submits the form with query value when Run Analysis is clicked", () => {
    const handleSearch = vi.fn();
    render(<SearchBar onSearch={handleSearch} />);

    const input = screen.getByRole("textbox", { name: /search inputs/i });
    fireEvent.change(input, { target: { value: "iPhone 15" } });

    const submitButton = screen.getByRole("button", { name: /run analysis/i });
    fireEvent.click(submitButton);

    expect(handleSearch).toHaveBeenCalledWith("iPhone 15");
  });
});
