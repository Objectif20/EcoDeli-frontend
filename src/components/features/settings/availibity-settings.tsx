"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Plus, Trash } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Availability, ProfileAPI } from "@/api/profile.api";
import { TimePickerInput } from "@/components/ui/time-picker-input";
import { toast } from "sonner";
import { useTranslation } from 'react-i18next';

const dayLabels = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

const timeStringToDate = (time: string): Date => {
  const [hours, minutes, seconds] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(seconds || 0);
  date.setMilliseconds(0);
  return date;
};

const AvailabilitySettings: React.FC = () => {
  const { t } = useTranslation();
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);

  useEffect(() => {
    const fetchAvailabilities = async () => {
      try {
        const data = await ProfileAPI.getMyAvailability();
        setAvailabilities(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des disponibilités", error);
      }
    };

    fetchAvailabilities();
  }, []);

  const handleTimeChange = (
    index: number,
    period: "morning" | "afternoon" | "evening",
    field: "start_time" | "end_time",
    date: Date | undefined
  ) => {
    const updated = [...availabilities];
    const timeString = date ? date.toTimeString().slice(0, 5) : null;
    updated[index][`${period}_${field}`] = timeString;
    setAvailabilities(updated);
  };

  const handleDayChange = (index: number, day: number) => {
    const updated = [...availabilities];
    updated[index].day_of_week = day;
    setAvailabilities(updated);
  };

  const handleAddDay = () => {
    const existingDays = availabilities.map((a) => a.day_of_week);
    const availableDays = [0, 1, 2, 3, 4, 5, 6].filter((day) => !existingDays.includes(day));

    if (availableDays.length > 0) {
      const newAvailability: Availability = {
        day_of_week: availableDays[0],
        morning: false,
        morning_start_time: null,
        morning_end_time: null,
        afternoon: false,
        afternoon_start_time: null,
        afternoon_end_time: null,
        evening: false,
        evening_start_time: null,
        evening_end_time: null,
      };
      setAvailabilities([...availabilities, newAvailability]);
    } else {
      toast.success(t('client.pages.office.settings.contactDetails.allDaysSelected'));
    }
  };

  const handleRemoveDay = (index: number) => {
    const updated = [...availabilities];
    updated.splice(index, 1);
    setAvailabilities(updated);
  };

  const handleSave = async () => {
    try {
      await ProfileAPI.updateMyAvailability(availabilities);
      toast.success(t('client.pages.office.settings.contactDetails.availabilityUpdated'));
    } catch (error) {
      console.error("Erreur lors de la mise à jour des disponibilités", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">{t('client.pages.office.settings.contactDetails.mySchedule')}</h2>
        <Button onClick={handleAddDay}>
          <Plus className="mr-2 h-4 w-4" /> {t('client.pages.office.settings.contactDetails.addDay')}
        </Button>
      </div>

      {availabilities.map((a, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between">
            <Select value={String(a.day_of_week)} onValueChange={(value) => handleDayChange(index, Number(value))}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t('client.pages.office.settings.contactDetails.selectDay')} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{t('client.pages.office.settings.contactDetails.day')}</SelectLabel>
                  {dayLabels.map((_, dayIndex) => (
                    <SelectItem
                      key={dayIndex}
                      value={String(dayIndex)}
                      disabled={
                        availabilities.some(
                          (av, i) => av.day_of_week === dayIndex && i !== index
                        )
                      }
                    >
                      {t(`client.pages.office.settings.contactDetails.days.${dayIndex}`)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button variant="destructive" size="icon" onClick={() => handleRemoveDay(index)}>
              <Trash className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {(["morning", "afternoon", "evening"] as const).map((period) => (
              <div key={period} className="grid grid-cols-[120px_1fr_1fr] items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="capitalize">
                    {t(`client.pages.office.settings.contactDetails.periods.${period}`)}
                  </span>
                </div>
                <div className="flex items-end gap-2">
                  <TimePickerInput
                    picker="hours"
                    date={a[`${period}_start_time`] ? timeStringToDate(a[`${period}_start_time`] || "") : undefined}
                    setDate={(date) =>
                      handleTimeChange(index, period, "start_time", date)
                    }
                  />
                  <TimePickerInput
                    picker="minutes"
                    date={a[`${period}_start_time`] ? timeStringToDate(a[`${period}_start_time`] || "") : undefined}
                    setDate={(date) => {
                      const current = a[`${period}_start_time`]
                        ? timeStringToDate(a[`${period}_start_time`] || "")
                        : new Date();
                      current.setMinutes(date?.getMinutes() || 0);
                      handleTimeChange(index, period, "start_time", current);
                    }}
                  />
                </div>
                <div className="flex items-end gap-2">
                  <TimePickerInput
                    picker="hours"
                    date={a[`${period}_end_time`] ? timeStringToDate(a[`${period}_end_time`] || "") : undefined}
                    setDate={(date) =>
                      handleTimeChange(index, period, "end_time", date)
                    }
                  />
                  <TimePickerInput
                    picker="minutes"
                    date={a[`${period}_end_time`] ? timeStringToDate(a[`${period}_end_time`] || "") : undefined}
                    setDate={(date) => {
                      const current = a[`${period}_end_time`]
                        ? timeStringToDate(a[`${period}_end_time`] || "")
                        : new Date();
                      current.setMinutes(date?.getMinutes() || 0);
                      handleTimeChange(index, period, "end_time", current);
                    }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {availabilities.length > 0 && (
        <div className="text-right">
          <Button onClick={handleSave}>{t('client.pages.office.settings.contactDetails.save')}</Button>
        </div>
      )}
    </div>
  );
};

export default AvailabilitySettings;
