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

export const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = createContext<FormFieldContextValue | null>(null);

export const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: ControllerProps<TFieldValues, TName>,
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

export const FormItem = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
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

export const FormLabel = forwardRef<
  ComponentRef<typeof Label>,
  ComponentPropsWithoutRef<typeof Label>
>(({ className, ...props }, ref) => {
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
});
FormLabel.displayName = "FormLabel";

export const FormControl = forwardRef<
  ComponentRef<typeof Slot>,
  ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
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
});
FormControl.displayName = "FormControl";

export const FormDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
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
});
FormDescription.displayName = "FormDescription";

export const FormMessage = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
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
