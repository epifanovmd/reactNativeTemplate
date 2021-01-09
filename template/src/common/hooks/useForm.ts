import React, { useCallback, useEffect, useMemo } from "react";
import { ObjectSchema, Shape } from "yup";

type TCheckArray<T> = T extends any[] ? T[number] : T;

interface IUseForm<T> {
  initialValues: T;
  onChange?: (
    values: T,
    errors: Partial<Record<keyof T | string, string>>,
  ) => void;
  onSubmit?: (
    values: T,
    errors: Partial<Record<keyof T | string, string>>,
  ) => void;
  validate?: (values: T) => Partial<Record<keyof T | string, string>>;
  validateSchema?: ObjectSchema<
    Shape<object | undefined, Partial<Record<keyof T, any>>>,
    object
    >;
  validateOnInit?: boolean;
}
export const useForm = <T extends object>(
  {
    initialValues,
    onSubmit,
    onChange,
    validate,
    validateSchema,
    validateOnInit,
  }: IUseForm<T>,
  watch?: (keyof T)[],
) => {
  const [values, setValues] = React.useState<T>(initialValues);
  const [touchedValues, setTouchedValues] = React.useState<
    Partial<Record<keyof T | string, boolean>>
    >({});
  const [errors, setErrors] = React.useState<
    Partial<Record<keyof T | string, string>>
    >({});

  const _validate = useCallback(
    (
      _values: T,
      _finally?: (
        _values: Partial<T>,
        errors: Partial<Record<keyof T | string, string>>,
      ) => void,
    ) => {
      if (validateSchema) {
        validateSchema
          .validate(_values, {
            strict: true,
            abortEarly: false,
          })
          .then(() => {
            setErrors(e => {
              if (Object.keys(e).length > 0) {
                return {};
              }
              Object.keys(e).forEach(key => {
                delete e[key];
              });

              return e;
            });
            _finally && _finally(_values, {});
          })
          .catch(err => {
            setErrors(e => {
              const inner = (err.inner || []) as {
                path: keyof T;
                errors: string[];
              }[];
              const prevErrors = { ...e };

              Object.keys(e).forEach(key => {
                delete e[key];
              });

              inner.forEach(item => {
                const split = (item.path as string).split(".");

                if (split[1]) {
                  if (split[0][split[0].length - 1] !== "]") {
                    e[split[0] as keyof T] = `${
                      e[split[0]] ? `${e[split[0]]}, ` : ""
                    }${(item.errors || []).join(",")}`;
                  } else {
                    e[`${split[0]}.${split[1]}` as keyof T] = `${
                      e[`${split[0]}.${split[1]}`]
                        ? `${e[`${split[0]}.${split[1]}`]}, `
                        : ""
                    }${(item.errors || []).join(",")}`;
                  }
                } else {
                  e[item.path] = (item.errors || []).join(",");
                }
              });

              const prevKeys = Object.keys(prevErrors);
              const eKeys = Object.keys(e);

              if (
                prevKeys.length !== eKeys.length ||
                prevKeys.some(key => prevErrors[key] !== e[key])
              ) {
                // eslint-disable-next-line no-param-reassign
                e = { ...e };
              }
              _finally && _finally(_values, e);

              return e;
            });
          });
      } else {
        const e: Partial<Record<keyof T | string, string>> | null = validate
          ? validate(_values)
          : null;

        setErrors(err => (e ? e : err));
        _finally && _finally(_values, { ...e } as any);
      }

      return _values;
    },
    [setErrors, validateSchema, validate],
  );

  useEffect(() => {
    onChange && onChange(values, errors);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, errors]);

  useEffect(() => {
    validateOnInit && _validate(values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSetValues = useCallback(
    (_values: T) => {
      setValues(_values);
      _validate(_values);
    },
    [setValues, _validate],
  );

  const getFields = useCallback(() => {
    const obj: Record<keyof T, string> = {} as Record<keyof T, string>;

    Object.keys(initialValues).forEach(key => {
      obj[key as keyof T] = key;
    });

    return obj;
  }, [initialValues]);

  const fieldNames = useMemo(() => getFields(), [getFields]);

  const fieldsHelper = useMemo(
    () => ({
      remove: (name: keyof T, index: number) => {
        setValues(state => {
          if (state[name]) {
            const newState = {
              ...state,
              [name]: ((state[name] as any) || []).filter(
                ({}, ind: number) => ind !== index,
              ),
            };

            _validate(newState);

            return newState;
          }

          return state;
        });
      },
      append: <K extends keyof T>(name: K, value: T[K]) => {
        setValues(state => ({
          ...state,
          [name]: [...(state[name] as any), ...(value as any)],
        }));
      },
      handleChange: ({ target }: React.ChangeEvent<any>) => {
        const name: keyof T = (target?.name || "").split("[")[0];
        const index = ((target?.name.match("\\[[0-9]{1,2}\\]") || [])[0] || -1)
          .split("]")[0]
          .split("[")[1];
        const key = (target?.name || "").split(".")[1];
        const value = target?.value;

        setValues(state => {
          state[name] = ((state[name] as any) || []).map(
            (item: any, ind: number) =>
              index && ind === +index
                ? {
                  ...item,
                  [key]: value,
                }
                : item,
          );
          let newValues = state;

          if ((watch && watch.some(item => item === name)) || !watch) {
            newValues = {
              ...state,
            };
          }

          _validate(newValues);

          return newValues;
        });
      },
      setFieldValue: <K extends keyof T, A extends T[K]>(
        name: K,
        key: keyof TCheckArray<A>,
        value:
          | ((state: T) => TCheckArray<A>[keyof TCheckArray<A>])
          | TCheckArray<A>[keyof TCheckArray<A>],
        index: number,
        touch?: boolean,
      ) => {
        setValues(state => {
          state[name] = ((state[name] as any) || []).map(
            (item: any, ind: number) =>
              ind === +index
                ? {
                  ...item,
                  [key]:
                    typeof value === "function"
                      ? (value as (
                      state: T,
                      ) => TCheckArray<A>[keyof TCheckArray<A>])(state)
                      : value,
                }
                : item,
          );
          let newValues = state;

          if (
            (watch && watch.some(item => item === name || item === key)) ||
            !watch
          ) {
            newValues = {
              ...state,
            };
          }

          _validate(newValues);

          return newValues;
        });
        !touchedValues[name] &&
        touch &&
        setTouchedValues(state => ({
          ...state,
          [name]: true,
        }));
      },
    }),
    [setValues, _validate, watch],
  );

  const fieldsIterate = useCallback(
    <A extends TCheckArray<T[B]>, B extends keyof T>(
      name: B,
      fields: (val: {
        value: A;
        touched: Partial<{ [key in keyof A]: boolean }>;
        error: Partial<{ [key in keyof A]: string }>;
        fieldNames: { [key in keyof A]: string };
        fieldsHelper: typeof fieldsHelper;
        index: number;
        array: A[];
      }) => void,
    ) =>
      ((values[name] as any) || []).map(
        (value: A, index: number, array: A[]) => {
          const touched: Partial<{ [key in keyof A]: boolean }> = {};
          const error: Partial<{ [key in keyof A]: string }> = {};
          const fieldNames: { [key in keyof A]: string } = {} as {
            [key in keyof A]: string;
          };

          Object.keys(value).forEach(item => {
            fieldNames[item as keyof A] = `${name}[${index}].${item}`;
            touched[item as keyof A] =
              touchedValues[`${name}[${index}].${item}`];
            error[item as keyof A] = errors[`${name}[${index}].${item}`];
          });

          return fields({
            fieldsHelper,
            value,
            index,
            touched,
            error,
            fieldNames,
            array,
          });
        },
      ),
    [fieldsHelper, values, touchedValues, errors],
  );

  const handleClearForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouchedValues({});
  }, [setValues, initialValues, setErrors, setTouchedValues]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<any>) => {
      const target = event?.target;
      const value =
        target?.type === "checkbox" || target?.type === "radio"
          ? target?.checked
          : target?.value;
      const name = target?.name;

      setValues(state => {
        state[name as keyof T] = value;
        let newValues = state;

        if ((watch && watch.some(item => item === name)) || !watch) {
          newValues = {
            ...state,
          };
        }

        _validate(newValues);

        return newValues;
      });
    },
    [setValues, _validate, watch],
  );

  const setFieldValue = useCallback(
    (
      name: keyof T,
      value: ((state: T) => T[keyof T]) | T[keyof T],
      touch?: boolean,
    ) => {
      setValues(state => {
        state[name] =
          typeof value === "function"
            ? (value as (state: T) => T[keyof T])(state)
            : value;
        let newValues = state;

        if ((watch && watch.some(item => item === name)) || !watch) {
          newValues = {
            ...state,
          };
        }

        _validate(newValues);

        return newValues;
      });
      !touchedValues[name] &&
      touch &&
      setTouchedValues(state => ({
        ...state,
        [name]: true,
      }));
    },
    [setValues, setTouchedValues, _validate, touchedValues, watch],
  );

  const handleBlur = useCallback(
    (event: React.FocusEvent<any>) => {
      const { target } = event;
      const { name } = target;

      if (name && !touchedValues[name]) {
        setTouchedValues(state => ({
          ...state,
          [name]: true,
        }));
        _validate(values);
      }
    },
    [setTouchedValues, _validate, values, touchedValues],
  );

  const setFieldBlur = useCallback(
    (name: keyof T | string) => {
      if (name && !touchedValues[name]) {
        setTouchedValues(state => ({
          ...state,
          [name]: true,
        }));
        _validate(values);
      }
    },
    [setTouchedValues, _validate, values, touchedValues],
  );

  const handleSubmit = useCallback(
    (event?: React.FormEvent<HTMLFormElement>) => {
      event?.preventDefault();
      _validate(values, ({}, e) => {
        setTouchedValues(
          (Object.keys(values) as (keyof T)[]).reduce((acc, el) => {
            const field = values[el] as any;

            if (
              Array.isArray(field) &&
              field[0] &&
              typeof field[0] === "object" &&
              !Array.isArray(field[0])
            ) {
              const obj: any = {};

              field.forEach((val, ind) => {
                Object.keys(val).forEach(key => {
                  obj[`${el}[${ind}].${key}`] = true;
                });
              });

              return {
                ...acc,
                ...obj,
              };
            }

            return {
              ...acc,
              [el]: true,
            };
          }, {}),
        );
        Object.keys({ ...e }).length === 0 && onSubmit && onSubmit(values, e);
      });
    },
    [values, onSubmit, _validate],
  );

  return {
    values,
    touchedValues,
    errors,
    fieldNames,
    onSetValues,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldBlur,
    handleSubmit,
    fieldsIterate,
    fieldsHelper,
    handleClearForm,
  };
};
