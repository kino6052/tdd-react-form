import { BehaviorSubject, combineLatest, concat } from "rxjs";
import { filter, skip, switchMap, take, tap, toArray } from "rxjs/operators";
import { Field001Service } from "./field01.service";
import { Field002Service } from "./field02.service";
import { Field003Service } from "./field03.service";
import { InitSubject } from "./init.service";
import { IInput, Service, SubmitId } from "./service";

export const StateSubject = new BehaviorSubject<IInput[]>([]);

combineLatest([
  Field001Service.StateSubject_(),
  Field002Service.StateSubject_(),
  Field003Service.StateSubject_()
]).subscribe((s) => StateSubject.next(s));

const concatOfClicks = () => {
  const r = StateSubject.getValue().map(({ id }, i) =>
    StateSubject.pipe(
      filter((state) => !state[i - 1]?.isDisabled),
      skip(+!!i),
      take(1),
      tap(() => Service.EventSubject.next(["click", `${id}-button`, ""]))
    )
  );
  return r;
};

export const SubmitSubject = () =>
  Service.OnClickSubject().pipe(
    filter(([, id]) => id === SubmitId),
    switchMap(() => concat(...concatOfClicks()).pipe(toArray())),
    switchMap(() =>
      StateSubject.pipe(
        filter((s) =>
          s.every(({ isDisabled, error }) => !isDisabled && !error)
        ),
        tap((s) => console.warn(s, "Submitted!")),
        take(1)
      )
    )
  );

InitSubject.subscribe(() => {
  SubmitSubject().subscribe();
});
