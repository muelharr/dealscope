import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@/testing/test-utils";
import { DealScore } from "./DealScore";

describe("DealScore Component", () => {
  it("renders score value correctly", () => {
    render(<DealScore score={85} />);
    expect(screen.getByText("85")).toBeInTheDocument();
  });

  it("clamps score values above 100 to 100", () => {
    render(<DealScore score={120} />);
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it("clamps score values below 0 to 0", () => {
    render(<DealScore score={-15} />);
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("displays Excellent label for score >= 80 when showLabel is true", () => {
    render(<DealScore score={85} showLabel />);
    expect(screen.getByText("85")).toBeInTheDocument();
    expect(screen.getByText("Excellent")).toBeInTheDocument();
  });

  it("displays Fair label for score between 50 and 79 when showLabel is true", () => {
    render(<DealScore score={65} showLabel />);
    expect(screen.getByText("65")).toBeInTheDocument();
    expect(screen.getByText("Fair")).toBeInTheDocument();
  });

  it("displays Poor label for score below 50 when showLabel is true", () => {
    render(<DealScore score={30} showLabel />);
    expect(screen.getByText("30")).toBeInTheDocument();
    expect(screen.getByText("Poor")).toBeInTheDocument();
  });
});
