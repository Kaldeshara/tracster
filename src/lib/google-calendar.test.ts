import assert from "node:assert/strict";
import test from "node:test";
import { demonstrationAudience, userCalendarAudience } from "@/lib/google-calendar";

function demoEvent(participants: string[], kind: "DEMONSTRATION" | "REHEARSAL" = "DEMONSTRATION") {
  return {
    id: "e1",
    type: { kind, name: kind },
    participants: participants.map((userId) => ({ userId })),
    choreography: null,
    group: null,
    title: "",
    description: null,
    notes: null,
    startsAt: new Date(),
    endsAt: null,
    location: null,
    listedLocation: null,
  } as Parameters<typeof demonstrationAudience>[0];
}

test("demonstrationAudience returns linked participant user ids", () => {
  assert.deepEqual(demonstrationAudience(demoEvent(["a", "b", "a"])), ["a", "b"]);
});

test("userCalendarAudience includes demonstrations", () => {
  assert.deepEqual(userCalendarAudience(demoEvent(["u1"])), ["u1"]);
  assert.deepEqual(userCalendarAudience(demoEvent([], "REHEARSAL")), []);
});