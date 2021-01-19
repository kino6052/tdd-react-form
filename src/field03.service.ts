import { BehaviorSubject, combineLatest, of } from "rxjs";
import { delay, filter, map, switchMap, tap } from "rxjs/operators";
import { Service } from "./service";
import { InitSubject } from "./init.service";
import { Field002Service } from "./field02.service";

export const Field003Id = "three";
export const Button003Id = "three-button";

export class Field003Service {
  static ValueSubject = new BehaviorSubject("");
  static ErrorSubject = new BehaviorSubject("");
  static IsTouchedSubject = new BehaviorSubject(false);
  static IsDisabledSubject = new BehaviorSubject(false);

  static ChangeSubject = () =>
    Service.OnChangeSubject().pipe(
      filter(([, id]) => id === Field003Id),
      map(([, , v]) => v),
      tap((v) => Field003Service.ValueSubject.next(v ?? ""))
    );

  static FocusSubject = () =>
    Service.OnFocusSubject().pipe(
      filter(([, id]) => id === Field003Id),
      tap(() => Field003Service.IsTouchedSubject.next(true))
    );

  static ClickSubject = () =>
    Service.OnClickSubject().pipe(filter(([, id]) => id === Button003Id));

  static validate = (prev: string, next: string): string | undefined => {
    if (!next) return "Should have value";
    if (prev !== next) return "This and previous fields don't match";
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
    Field003Service.ClickSubject().pipe(
      tap(() => Field003Service.IsDisabledSubject.next(true)),
      switchMap(() =>
        of([
          Field002Service.ValueSubject.getValue(),
          Field003Service.ValueSubject.getValue()
        ]).pipe(
          delay(1000),
          tap(([prev, next]) => {
            Field003Service.IsDisabledSubject.next(false);
            Field003Service.ErrorSubject.next(
              Field003Service.validate(prev, next) ?? ""
            );
          })
        )
      )
    );

  static init = () => {
    Field003Service.ChangeSubject().subscribe();
    Field003Service.ClickSubject().subscribe();
    Field003Service.FocusSubject().subscribe();
    Field003Service.ValidationSubject().subscribe();
  };

  static StateSubject_ = () =>
    combineLatest([
      Field003Service.ValueSubject,
      Field003Service.ErrorSubject,
      Field003Service.IsDisabledSubject,
      Field003Service.IsTouchedSubject
    ]).pipe(
      map(([value, error, isDisabled, isTouched]) => ({
        id: Field003Id,
        isTouched,
        isDisabled,
        value,
        error
      }))
    );
}

InitSubject.subscribe(() => {
  Field003Service.init();
});
