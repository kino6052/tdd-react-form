import { BehaviorSubject, combineLatest, of } from "rxjs";
import { delay, filter, map, switchMap, tap } from "rxjs/operators";
import { Service } from "./service";
import { InitSubject } from "./init.service";
import { Field001Service } from "./field01.service";

export const Field002Id = "two";
export const Button002Id = "two-button";

export class Field002Service {
  static ValueSubject = new BehaviorSubject("");
  static ErrorSubject = new BehaviorSubject("");
  static IsTouchedSubject = new BehaviorSubject(false);
  static IsDisabledSubject = new BehaviorSubject(false);

  static ChangeSubject = () =>
    Service.OnChangeSubject().pipe(
      filter(([, id]) => id === Field002Id),
      map(([, , v]) => v),
      tap((v) => Field002Service.ValueSubject.next(v ?? ""))
    );

  static FocusSubject = () =>
    Service.OnFocusSubject().pipe(
      filter(([, id]) => id === Field002Id),
      tap(() => Field002Service.IsTouchedSubject.next(true))
    );

  static ClickSubject = () =>
    Service.OnClickSubject().pipe(filter(([, id]) => id === Button002Id));

  static validate = (e: string, v: string): string | undefined => {
    if (!v) return "Should have value";
    if (e) return "Fix phone number above";
  };

  static formatPhone = (s: string = "") => {
    const r = s.replace(/\D/g, "");
    const m = r.match(/^(\d{1,3})(\d{1,3})?(\d{1,})?$/);
    const first = (m?.[1] && `(${m[1]}`) ?? "";
    const second = (m?.[2] && `) ${m[2]}`) ?? "";
    const third = (m?.[3] && `-${m[3].substring(0, 4)}`) ?? "";
    return first + second + third;
  };

  static ValidationSubject = () =>
    Field002Service.ClickSubject().pipe(
      tap(() => Field002Service.IsDisabledSubject.next(true)),
      switchMap(() =>
        of([
          Field001Service.ErrorSubject.getValue(),
          Field002Service.ValueSubject.getValue()
        ]).pipe(
          delay(1000),
          tap(([error, value]) => {
            Field002Service.IsDisabledSubject.next(false);
            Field002Service.ErrorSubject.next(
              Field002Service.validate(error, value) ?? ""
            );
          })
        )
      )
    );

  static init = () => {
    Field002Service.ChangeSubject().subscribe();
    Field002Service.ClickSubject().subscribe();
    Field002Service.FocusSubject().subscribe();
    Field002Service.ValidationSubject().subscribe();
  };

  static StateSubject_ = () =>
    combineLatest([
      Field002Service.ValueSubject,
      Field002Service.ErrorSubject,
      Field002Service.IsDisabledSubject,
      Field002Service.IsTouchedSubject
    ]).pipe(
      map(([value, error, isDisabled, isTouched]) => ({
        id: Field002Id,
        isTouched,
        isDisabled,
        value,
        error
      }))
    );
}

InitSubject.subscribe(() => {
  Field002Service.init();
});
