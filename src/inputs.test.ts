// import React from "react";
// import { Subject } from "rxjs";
// import { distinctUntilChanged, skip, tap } from "rxjs/operators";
// import { EventType, Id, Service } from "./service";

// const ResetSubject = new Subject();

// const createEvent = (value: string) =>
//   (({
//     target: {
//       value
//     }
//   } as unknown) as React.SyntheticEvent);

// beforeEach(() => {
//   ResetSubject.next();
// });

// describe("Events", () => {
//   it("should trigger on change", () => {
//     const spy = jest.fn();
//     Service.OnChangeSubject.subscribe(spy);
//     const args: [EventType, Id, React.SyntheticEvent] = [
//       "change",
//       "1",
//       createEvent("test")
//     ];
//     Service.EventSubject.next(args);
//     expect(spy).toHaveBeenCalledTimes(1);
//     expect(spy).toHaveBeenCalledWith(args);
//   });
// });

// describe("Input One", () => {
//   it("should update state on change", () => {
//     const args: [EventType, Id, React.SyntheticEvent] = [
//       "change",
//       "one",
//       createEvent("test")
//     ];
//     const spy = jest.fn();

//     Service.getInputChangeSubject("one").subscribe(spy);

//     Service.Input01Subject.subscribe();
//     Service.EventSubject.next(args);

//     expect(spy).toHaveBeenCalledTimes(1);
//     expect(spy).toHaveBeenCalledWith("test");
//   });

//   it("should format value to upper case", async () => {
//     const spy = jest.fn();

//     Service.Field01Subject.subscribe(spy);
//     Service.UpperCase01.subscribe();
//     const args: [EventType, Id, React.SyntheticEvent] = [
//       "change",
//       "one",
//       createEvent("check")
//     ];
//     Service.EventSubject.next(args);
//     Service.OnChangeSubject.subscribe();
//     // Service.Field01Subject.next({ id: "one", value: "check", isTouched: true });

//     expect(spy).toHaveBeenCalledTimes(4);
//     expect(spy).toHaveBeenLastCalledWith({
//       id: "one",
//       value: "CHECK",
//       isTouched: false
//     });
//   });
// });
