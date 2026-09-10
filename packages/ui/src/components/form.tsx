"use client";

import { Slot } from "@radix-ui/react-slot";
import {
  type ComponentPropsWithoutRef,
  type ComponentRef,
  createContext,
  forwardRef,
  type HTMLAttributes,
  useContext,
  useId,
} from "react";
import {
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  FormProvider,
  useFormContext,
  useFormState,
} from "react-hook-form";
import { cn } from "../lib/cn.js";
import { Label } from "./label.js";

export { useFormContext };

/** Props for {@link Form}. */
export type FormProps = ComponentPropsWithoutRef<typeof FormProvider>;

export const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = createContext<FormFieldContextValue | null>(null);

/** Props for {@link FormField}. */
export type FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = ControllerProps<TFieldValues, TName>;

export const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: FormFieldProps<TFieldValues, TName>,
) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = createContext<FormItemContextValue | null>(null);

export const useFormField = () => {
  const fieldContext = useContext(FormFieldContext);
  const itemContext = useContext(FormItemContext);
  const form = useFormContext();
  const formState = useFormState({ name: fieldContext?.name });

  if (!form) {
    throw new Error("useFormField must be used within a <Form> (FormProvider)");
  }
  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const fieldState = form.getFieldState(fieldContext.name, formState);

  if (!itemContext) {
    throw new Error("useFormField should be used within <FormItem>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

/** Props for {@link FormItem}. */
export type FormItemProps = HTMLAttributes<HTMLDivElement>;

export const FormItem = forwardRef<HTMLDivElement, FormItemProps>(
  ({ className, ...props }, ref) => {
    const id = useId();
    return (
      <FormItemContext.Provider value={{ id }}>
        <div
          ref={ref}
          data-slot="form-item"
          className={cn("flex flex-col gap-1.5", className)}
          {...props}
        />
      </FormItemContext.Provider>
    );
  },
);
FormItem.displayName = "FormItem";

/** Props for {@link FormLabel}. */
export type FormLabelProps = ComponentPropsWithoutRef<typeof Label>;

export const FormLabel = forwardRef<ComponentRef<typeof Label>, FormLabelProps>(
  ({ className, ...props }, ref) => {
    const { error, formItemId } = useFormField();
    return (
      <Label
        ref={ref}
        data-slot="form-label"
        data-error={!!error}
        htmlFor={formItemId}
        className={cn(error && "text-error-strong", className)}
        {...props}
      />
    );
  },
);
FormLabel.displayName = "FormLabel";

/** Props for {@link FormControl}. */
export type FormControlProps = ComponentPropsWithoutRef<typeof Slot>;

export const FormControl = forwardRef<ComponentRef<typeof Slot>, FormControlProps>(
  ({ ...props }, ref) => {
    const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
    return (
      <Slot
        ref={ref}
        data-slot="form-control"
        id={formItemId}
        aria-describedby={error ? `${formDescriptionId} ${formMessageId}` : formDescriptionId}
        aria-invalid={!!error}
        {...props}
      />
    );
  },
);
FormControl.displayName = "FormControl";

/** Props for {@link FormDescription}. */
export type FormDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

export const FormDescription = forwardRef<HTMLParagraphElement, FormDescriptionProps>(
  ({ className, ...props }, ref) => {
    const { formDescriptionId } = useFormField();
    return (
      <p
        ref={ref}
        data-slot="form-description"
        id={formDescriptionId}
        className={cn("text-xs text-fg-secondary", className)}
        {...props}
      />
    );
  },
);
FormDescription.displayName = "FormDescription";

/** Props for {@link FormMessage}. */
export type FormMessageProps = HTMLAttributes<HTMLParagraphElement>;

export const FormMessage = forwardRef<HTMLParagraphElement, FormMessageProps>(
  ({ className, children, ...props }, ref) => {
    const { error, formMessageId } = useFormField();
    const body = error ? String(error?.message ?? "") : children;

    if (!body) return null;

    return (
      <p
        ref={ref}
        data-slot="form-message"
        id={formMessageId}
        role="alert"
        className={cn("text-xs text-error-strong", className)}
        {...props}
      >
        {body}
      </p>
    );
  },
);
FormMessage.displayName = "FormMessage";
