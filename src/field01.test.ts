import { map, skip, take } from "rxjs/operators";
import { Button001Id, Field001Id, Field001Service } from "./field01.service";
import { Service } from "./service";

beforeEach(() => {
  Field001Service.ErrorSubject.next("");
  Field001Service.ValueSubject.next("");
  Field001Service.IsDisabledSubject.next(false);
  Field001Service.IsTouchedSubject.next(false);
});

describe("Field 001", () => {
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
    Field001Service.ChangeSubject().pipe(take(1)).subscribe(spy);
    Service.EventSubject.next(["change", Field001Id, "test"]);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith("test");
  });

  it("should get touched on focus", () => {
    const spy = jest.fn();
    Field001Service.StateSubject_().pipe(skip(1), take(1)).subscribe(spy);
    Field001Service.FocusSubject().pipe(take(1)).subscribe();
    Service.OnFocusSubject().next(["focus", Field001Id, ""]);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0].isTouched).toBe(true);
  });

  it("should validate input on button click", async () => {
    expect(Field001Service.ErrorSubject.getValue()).toBe("");
    const result = Field001Service.ValidationSubject()
      .pipe(
        take(1),
        map(() => Field001Service.ErrorSubject.getValue())
      )
      .toPromise();
    Service.OnClickSubject().next(["click", Button001Id, ""]);
    const res = await result;
    expect(res).toEqual("Should have value");
  });
});
