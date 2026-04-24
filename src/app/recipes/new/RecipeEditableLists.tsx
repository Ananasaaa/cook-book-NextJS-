"use client";

import Image from "next/image";
import {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import styles from "./create-recipe.module.css";

//константы-идентификаторы типа перетаскиваемого элемента для drag-and-drop
const MIME_INGREDIENT = "ingredient";
const MIME_STEP = "step";

function DragIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true">
      <path
        d="M4 8H24"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M4 14H24"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M4 20H24"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DotsIcon() {
  return (
    <svg
      width="26"
      height="8"
      viewBox="0 0 26 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true">
      <circle cx="4" cy="4" r="2" fill="currentColor" />
      <circle cx="13" cy="4" r="2" fill="currentColor" />
      <circle cx="22" cy="4" r="2" fill="currentColor" />
    </svg>
  );
}

type DotMenuProps = {
  menuId: string;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onDelete: () => void;
};

//menu component
function DotMenu({
  menuId,
  isOpen,
  onToggle,
  onClose,
  onDelete,
}: DotMenuProps) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e: PointerEvent) => {
      if (wrapRef.current?.contains(e.target as Node)) return;
      onClose();
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen, onClose]);

  return (
    <div className={styles.menuWrap} ref={wrapRef}>
      <button
        type="button"
        className={styles.iconButton}
        aria-label="More actions"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls={isOpen ? `${menuId}-menu` : undefined}
        onClick={onToggle}>
        <DotsIcon />
      </button>

      {isOpen && (
        <div
          id={`${menuId}-menu`}
          className={styles.menu}
          role="menu"
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              onClose();
            }
          }}>
          <button
            type="button"
            className={styles.menuItem}
            role="menuitem"
            onClick={() => {
              onDelete();
              onClose();
            }}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export type IngredientLine = {
  id: string;
  kind: "ingredient" | "chapter";
  value: string;
};

export type StepLine = {
  id: string;
  value: string;
};

export type RecipeEditableListsRef = {
  getSnapshot: () => {
    ingredientLines: { kind: "ingredient" | "chapter"; value: string }[];
    steps: { value: string }[];
  };
};

function newLineId() {
  return `line-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function linePlaceholder(kind: IngredientLine["kind"]) {
  return kind === "chapter" ? "Chapter title" : "e.g. 250 g flour";
}

//перемещение элементов по id
function reorderById<T extends { id: string }>(
  items: T[],
  activeId: string,
  overId: string,
) {
  if (activeId === overId) {
    return items;
  }

  const fromIndex = items.findIndex((item) => item.id === activeId);
  const toIndex = items.findIndex((item) => item.id === overId);

  if (fromIndex === -1 || toIndex === -1) {
    return items;
  }

  const next = [...items];
  const movedItem = next[fromIndex]; //эл из массива по индексу

  next.splice(fromIndex, 1);
  next.splice(toIndex, 0, movedItem);

  return next;
}

//для очистки временного url фото шага
function revokeBlobUrl(url?: string) {
  if (url?.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}

function getRowClassName(
  baseClass: string,
  isDragging: boolean,
  isDropTarget: boolean,
) {
  return [
    baseClass,
    isDragging ? styles.rowDragging : "",
    isDropTarget ? styles.rowDropTarget : "",
  ]
    .filter(Boolean)
    .join(" ");
}

//main component
const RecipeEditableLists = forwardRef<RecipeEditableListsRef>(
  function RecipeEditableLists(_, ref) {
    const baseId = useId();

    const [ingredientLines, setIngredientLines] = useState<IngredientLine[]>([
      { id: "i1", kind: "ingredient", value: "250 g flour" },
      { id: "i2", kind: "ingredient", value: "100 ml water" },
      { id: "i3", kind: "ingredient", value: "250 g flour" },
    ]);

    const [steps, setSteps] = useState<StepLine[]>([
      { id: "s1", value: "Put the flour in a bowl." },
      { id: "s2", value: "" },
    ]);

    const [openMenu, setOpenMenu] = useState<string | null>(null);
    //перемещение ингредиента
    const [draggingIngredientId, setDraggingIngredientId] = useState<
      string | null
    >(null);
    const [dropTargetIngredientId, setDropTargetIngredientId] = useState<
      string | null
    >(null);

    //перемещение шага
    const [draggingStepId, setDraggingStepId] = useState<string | null>(null);
    const [dropTargetStepId, setDropTargetStepId] = useState<string | null>(
      null,
    );
    //хранение фото шага
    const [stepPhotoById, setStepPhotoById] = useState<Record<string, string>>(
      {},
    );
    const stepPhotoByIdRef = useRef<Record<string, string>>({});

    useEffect(() => {
      stepPhotoByIdRef.current = stepPhotoById;
    }, [stepPhotoById]);

    useEffect(() => {
      return () => {
        const photoUrls = Object.values(stepPhotoByIdRef.current);

        photoUrls.forEach((url) => {
          revokeBlobUrl(url);
        });
      };
    }, []);

    const closeMenu = () => {
      setOpenMenu(null);
    };

    //хранение фото шага
    const handleStepPhoto = (
      stepId: string,
      e: React.ChangeEvent<HTMLInputElement>,
    ) => {
      const file = e.target.files?.[0];

      if (!file || !file.type.startsWith("image/")) {
        return;
      }

      setStepPhotoById((prev) => {
        revokeBlobUrl(prev[stepId]);

        return {
          ...prev,
          [stepId]: URL.createObjectURL(file),
        };
      });

      e.target.value = "";
    };

    //добавление ингредиента
    const addIngredientLine = () => {
      setIngredientLines((prev) => [
        ...prev,
        { id: newLineId(), kind: "ingredient", value: "" },
      ]);
    };

    const addChapterLine = () => {
      setIngredientLines((prev) => [
        ...prev,
        { id: newLineId(), kind: "chapter", value: "" },
      ]);
    };

    const removeIngredientLine = (id: string) => {
      setIngredientLines((prev) => prev.filter((line) => line.id !== id));
    };

    const updateIngredientLine = (id: string, value: string) => {
      setIngredientLines((prev) =>
        prev.map((line) => (line.id === id ? { ...line, value } : line)),
      );
    };

    //удаление шага
    const removeStep = (id: string) => {
      setStepPhotoById((prev) => {
        const next = { ...prev };
        revokeBlobUrl(next[id]);
        delete next[id];
        return next;
      });

      setSteps((prev) => prev.filter((step) => step.id !== id));
    };

    const updateStep = (id: string, value: string) => {
      setSteps((prev) =>
        prev.map((step) => (step.id === id ? { ...step, value } : step)),
      );
    };

    const addStep = () => {
      setSteps((prev) => [...prev, { id: newLineId(), value: "" }]);
    };

    //передача данных из компонента наружу через ref
    useImperativeHandle(
      ref,
      () => ({
        getSnapshot: () => ({
          ingredientLines: ingredientLines.map(({ kind, value }) => ({
            kind,
            value,
          })),
          steps: steps.map(({ value }) => ({ value })),
        }),
      }),
      [ingredientLines, steps],
    );

    return (
      <section className={styles.bottomGrid}>
        <div className={styles.column}>
          <h2 className={styles.sectionTitle}>Ingredients</h2>

          <div className={styles.metaRow}>
            <label className={styles.metaLabel} htmlFor={`${baseId}-servings`}>
              Servings
            </label>
            <input
              id={`${baseId}-servings`}
              className={styles.metaInput}
              placeholder="How many servings?"
              type="text"
            />
          </div>

          {/* ingredients/chapters */}
          <div className={styles.list}>
            {ingredientLines.map((line) => {
              const menuKey = `${baseId}-line-${line.id}`;
              const isDragging = draggingIngredientId === line.id;
              const isDropTarget = dropTargetIngredientId === line.id;

              return (
                <div
                  key={line.id}
                  className={getRowClassName(
                    styles.ingredientRow,
                    isDragging,
                    isDropTarget,
                  )}
                  onDragOver={(e) => {
                    if (!draggingIngredientId) return;

                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                    setDropTargetIngredientId(line.id);
                  }}
                  onDragLeave={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                      setDropTargetIngredientId(null);
                    }
                  }}
                  onDrop={(e) => {
                    e.preventDefault();

                    const sourceId =
                      e.dataTransfer.getData(MIME_INGREDIENT) ||
                      e.dataTransfer.getData("text/plain");

                    setDropTargetIngredientId(null);

                    if (!sourceId || sourceId === line.id) return;
                    //меняем порядрк
                    setIngredientLines((prev) =>
                      reorderById(prev, sourceId, line.id),
                    );
                  }}>
                  {/*кнопка перенос для ingredients*/}
                  <div
                    className={`${styles.iconButton} ${styles.dragHandle}`}
                    draggable
                    role="button"
                    tabIndex={0}
                    aria-label="Drag to reorder"
                    aria-grabbed={isDragging}
                    onDragStart={(e) => {
                      e.dataTransfer.setData(MIME_INGREDIENT, line.id);
                      e.dataTransfer.setData("text/plain", line.id);
                      e.dataTransfer.effectAllowed = "move";
                      setDraggingIngredientId(line.id);
                    }}
                    onDragEnd={() => {
                      //когда перетаскивание закончилось очищаем состояния
                      setDraggingIngredientId(null);
                      setDropTargetIngredientId(null);
                    }}>
                    <DragIcon />
                  </div>

                  {/* input для ингредиента */}
                  <input
                    className={styles.lineInput}
                    value={line.value}
                    placeholder={linePlaceholder(line.kind)}
                    onChange={(e) =>
                      updateIngredientLine(line.id, e.target.value)
                    }
                    type="text"
                  />

                  {/* меню удаления ингредиента */}
                  <DotMenu
                    menuId={menuKey}
                    isOpen={openMenu === menuKey}
                    onToggle={() =>
                      setOpenMenu((prev) => (prev === menuKey ? null : menuKey))
                    }
                    onClose={closeMenu}
                    onDelete={() => removeIngredientLine(line.id)}
                  />
                </div>
              );
            })}
          </div>

          {/* кнопки добавления ингредиента/главы */}
          <div className={styles.ingredientAddRow}>
            <button
              type="button"
              className={`${styles.ingredientAddButton} ${styles.ingredientAddButtonPrimary}`}
              onClick={addIngredientLine}>
              Add ingredient
            </button>

            <button
              type="button"
              className={`${styles.ingredientAddButton} ${styles.ingredientAddButtonSecondary}`}
              onClick={addChapterLine}>
              Add chapter
            </button>
          </div>
        </div>

        <div className={styles.column}>
          <h2 className={styles.sectionTitle}>How to cook</h2>

          <div className={styles.metaRow}>
            <label className={styles.metaLabel} htmlFor={`${baseId}-time`}>
              Cooking time
            </label>
            <input
              id={`${baseId}-time`}
              className={styles.metaInput}
              placeholder="Total cooking time"
              type="text"
            />
          </div>

          <div className={styles.stepsList}>
            {steps.map((step, index) => {
              const menuKey = `${baseId}-step-${step.id}`;
              const isDragging = draggingStepId === step.id;
              const isDropTarget = dropTargetStepId === step.id;

              return (
                <div key={step.id}>
                  {/* одна строка шага */}
                  <div
                    className={getRowClassName(
                      styles.stepRow,
                      isDragging,
                      isDropTarget,
                    )}
                    onDragOver={(e) => {
                      if (!draggingStepId) return;

                      e.preventDefault();
                      e.dataTransfer.dropEffect = "move";
                      setDropTargetStepId(step.id);
                    }}
                    onDragLeave={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                        setDropTargetStepId(null);
                      }
                    }}
                    onDrop={(e) => {
                      e.preventDefault();

                      const sourceId =
                        e.dataTransfer.getData(MIME_STEP) ||
                        e.dataTransfer.getData("text/plain");

                      setDropTargetStepId(null);

                      if (!sourceId || sourceId === step.id) return;

                      setSteps((prev) => reorderById(prev, sourceId, step.id));
                    }}>
                    <div className={styles.stepLeft}>
                      <div className={styles.stepNumber}>{index + 1}</div>

                      <div
                        className={`${styles.iconButton} ${styles.dragHandle}`}
                        draggable
                        role="button"
                        tabIndex={0}
                        aria-label="Drag to reorder"
                        aria-grabbed={isDragging}
                        onDragStart={(e) => {
                          e.dataTransfer.setData(MIME_STEP, step.id);
                          e.dataTransfer.setData("text/plain", step.id);
                          e.dataTransfer.effectAllowed = "move";
                          setDraggingStepId(step.id);
                        }}
                        onDragEnd={() => {
                          setDraggingStepId(null);
                          setDropTargetStepId(null);
                        }}>
                        <DragIcon />
                      </div>
                    </div>

                    <input
                      className={styles.stepInput}
                      value={step.value}
                      placeholder="Describe this step"
                      onChange={(e) => updateStep(step.id, e.target.value)}
                      type="text"
                    />

                    <DotMenu
                      menuId={menuKey}
                      isOpen={openMenu === menuKey}
                      onToggle={() =>
                        setOpenMenu((prev) =>
                          prev === menuKey ? null : menuKey,
                        )
                      }
                      onClose={closeMenu}
                      onDelete={() => removeStep(step.id)}
                    />
                  </div>

                  <label
                    className={`${styles.stepImageBox} ${styles.stepImageBoxClickable}`}
                    aria-label={
                      stepPhotoById[step.id]
                        ? "Change step photo"
                        : "Add step photo"
                    }>
                    <input
                      type="file"
                      accept="image/*"
                      className={styles.srOnly}
                      onChange={(e) => handleStepPhoto(step.id, e)}
                    />

                    {stepPhotoById[step.id] ? (
                      <div className={styles.stepStepPhotoPreview}>
                        <Image
                          src={stepPhotoById[step.id]}
                          alt=""
                          fill
                          unoptimized
                          sizes="210px"
                          className={styles.stepStepPhotoPreviewImg}
                        />
                      </div>
                    ) : (
                      <Image
                        src="/add-photo.png"
                        alt=""
                        width={44}
                        height={44}
                        className={styles.addPhotoImageSmall}
                      />
                    )}
                  </label>
                </div>
              );
            })}
          </div>

          <div className={styles.ingredientAddRow}>
            <button
              type="button"
              className={`${styles.ingredientAddButton} ${styles.ingredientAddButtonPrimary}`}
              onClick={addStep}>
              Add step
            </button>
          </div>
        </div>
      </section>
    );
  },
);

export default RecipeEditableLists;
