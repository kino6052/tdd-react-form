import { map, skip, take } from "rxjs/operators";
import { Button001Id, Field001Id, Field001Service } from "./field01.service";
import { Button002Id, Field002Id, Field002Service } from "./field02.service";
import { Service } from "./service";

beforeEach(() => {
  Field002Service.ErrorSubject.next("");
  Field002Service.ValueSubject.next("");
  Field002Service.IsDisabledSubject.next(false);
  Field002Service.IsTouchedSubject.next(false);
});

describe("Field 002", () => {
  it("should format ", () => {
    const format = (s: string) => {
      const r = s.replace(/\D/g, "");
      const m = r.match(/^(\d{1,3})(\d{1,3})?(\d{1,4})?$/);
      const first = (m?.[1] && `(${m[1]}`) ?? "";
      const second = (m?.[2] && `) ${m[2]}`) ?? "";
      const third = (m?.[3] && `-${m[3]}`) ?? "";
      return first + second + third;
    };
    expect(format("1")).toEqual("(1");
    expect(format("123")).toEqual("(123");
    expect(format("12334")).toEqual("(123) 34");
    expect(format("1233455")).toEqual("(123) 345-5");
    expect(format("1233455777")).toEqual("(123) 345-5777");
  });

  it("should react on change", () => {
    const spy = jest.fn();
    Field002Service.ChangeSubject().pipe(take(1)).subscribe(spy);
    Service.EventSubject.next(["change", Field002Id, "test"]);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith("test");
  });

  it("should get touched on focus", () => {
    const spy = jest.fn();
    Field002Service.StateSubject_().pipe(skip(1), take(1)).subscribe(spy);
    Field002Service.FocusSubject().pipe(take(1)).subscribe();
    Service.OnFocusSubject().next(["focus", Field002Id, ""]);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0].isTouched).toBe(true);
  });

  it("should validate input on button click", async () => {
    expect(Field002Service.ErrorSubject.getValue()).toBe("");
    const result = Field002Service.ValidationSubject()
      .pipe(
        take(1),
        map(() => Field002Service.ErrorSubject.getValue())
      )
      .toPromise();
    Service.OnClickSubject().next(["click", Button002Id, ""]);
    const res = await result;
    expect(res).toEqual("Should have value");
  });
});
