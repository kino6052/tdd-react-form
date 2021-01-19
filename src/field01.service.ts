import { BehaviorSubject, combineLatest, of } from "rxjs";
import { delay, filter, map, switchMap, tap } from "rxjs/operators";
import { Service } from "./service";
import { InitSubject } from "./init.service";

export const Field001Id = "one";
export const Button001Id = "one-button";

export class Field001Service {
  // State
  static ValueSubject = new BehaviorSubject("");
  static ErrorSubject = new BehaviorSubject("");
  static IsTouchedSubject = new BehaviorSubject(false);
  static IsDisabledSubject = new BehaviorSubject(false);

  // IO
  static ChangeSubject = () =>
    Service.OnChangeSubject().pipe(
      filter(([, id]) => id === Field001Id),
      map(([, , v]) => v),
      tap((v) => Field001Service.ValueSubject.next(v ?? ""))
    );

  static FocusSubject = () =>
    Service.OnFocusSubject().pipe(
      filter(([, id]) => id === Field001Id),
      tap(() => Field001Service.IsTouchedSubject.next(true))
    );

  static ClickSubject = () =>
    Service.OnClickSubject().pipe(filter(([, id]) => id === Button001Id));

  // Init
  static init = () => {
    Field001Service.ChangeSubject().subscribe();
    Field001Service.ClickSubject().subscribe();
    Field001Service.FocusSubject().subscribe();
    Field001Service.ValidationSubject().subscribe();
  };

  // Utils
  static validate = (v: string | undefined): string | undefined => {
    if (!v) return "Should have value";
    if (v.length < 10) return "Enter full number";
  };

  static formatPhone = (s: string = "") => {
    const r = s.replace(/\D/g, "");
    const m = r.match(/^(\d{1,3})(\d{1,3})?(\d{1,})?$/);
    const first = (m?.[1] && `(${m[1]}`) ?? "";
    const second = (m?.[2] && `) ${m[2]}`) ?? "";
    const third = (m?.[3] && `-${m[3].substring(0, 4)}`) ?? "";
    return first + second + third;
  };

  // Computed
  static ValidationSubject = () =>
    Field001Service.ClickSubject().pipe(
      tap(() => Field001Service.IsDisabledSubject.next(true)),
      switchMap(() =>
        of(Field001Service.ValueSubject.getValue()).pipe(
          delay(1000),
          tap((value) => {
            Field001Service.IsDisabledSubject.next(false);
            Field001Service.ErrorSubject.next(
              Field001Service.validate(value) ?? ""
            );
          })
        )
      )
    );

  static StateSubject_ = () =>
    combineLatest([
      Field001Service.ValueSubject,
      Field001Service.ErrorSubject,
      Field001Service.IsDisabledSubject,
      Field001Service.IsTouchedSubject
    ]).pipe(
      map(([value, error, isDisabled, isTouched]) => ({
        id: Field001Id,
        isTouched,
        isDisabled,
        value: Field001Service.formatPhone(value),
        error
      }))
    );
}

InitSubject.subscribe(() => {
  Field001Service.init();
});
