"use client";

import { useEffect, useId, useRef, useState } from "react";

import styles from "./create-recipe.module.css";

type Option = { key: string; label: string };

type RecipeFormSelectProps = {
  caption: string;
  options: Option[];
  value: string;
  onChange: (key: string) => void;
};

export default function RecipeFormSelect({
  caption,
  options,
  value,
  onChange,
}: RecipeFormSelectProps) {
  const labelId = useId();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.key === value) ?? options[0];

  useEffect(() => {
    if (!open) {
      return;
    }
    function handlePointerDown(e: PointerEvent) {
      if (rootRef.current?.contains(e.target as Node)) {
        return;
      }
      setOpen(false);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className={styles.selectField} ref={rootRef}>
      <span className={styles.selectCaption} id={labelId}>
        {caption}
      </span>
      <div
        className={`${styles.selectRoot} ${open ? styles.selectRootOpen : ""}`}>
        <button
          type="button"
          className={`${styles.selectTrigger} ${open ? styles.selectTriggerOpen : ""}`}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-labelledby={labelId}
          onClick={() => setOpen((v) => !v)}>
          <span className={styles.selectTriggerLabel}>{selected?.label}</span>
          <span
            className={`${styles.selectChevron} ${open ? styles.selectChevronOpen : ""}`}
            aria-hidden
          />
        </button>
        {open ? (
          <ul className={styles.selectList} role="listbox">
            {options.map((opt) => (
              <li key={opt.key} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={opt.key === value}
                  className={
                    opt.key === value
                      ? `${styles.selectOption} ${styles.selectOptionActive}`
                      : styles.selectOption
                  }
                  onClick={() => {
                    onChange(opt.key);
                    setOpen(false);
                  }}>
                  {opt.label}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
