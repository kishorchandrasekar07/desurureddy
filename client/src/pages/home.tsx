import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Check, Loader2, Send, RotateCcw, ChevronsUpDown } from "lucide-react";
import { insertSubmissionSchema, type InsertSubmission, GOTHRAM_OPTIONS, GOTHRAM_HOUSE_DATA, GENDER_OPTIONS } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import landingImage from "@assets/image_1766928192688.png";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [gothramOpen, setGothramOpen] = useState(false);
  const [houseNameOpen, setHouseNameOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<InsertSubmission>({
    resolver: zodResolver(insertSubmissionSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      community: "Desuru Reddy",
      gender: undefined,
      dateOfBirth: "",
      presentAddress: "",
      nativePlace: "",
      gothram: "",
      houseName: "",
      otherGothram: "",
      otherHouseName: "",
      state: "",
      county: "",
    },
  });

  const selectedGothram = form.watch("gothram");

  const houseNameOptions = useMemo(() => {
    if (!selectedGothram || selectedGothram === "Other") {
      return [];
    }
    return GOTHRAM_HOUSE_DATA[selectedGothram] || [];
  }, [selectedGothram]);

  const submitMutation = useMutation({
    mutationFn: async (data: InsertSubmission) => {
      const response = await apiRequest("POST", "/api/submissions", data);
      return response.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
    },
    onError: (error: Error) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertSubmission) => {
    if (data.gothram !== "Other") {
      data.otherGothram = undefined;
      data.otherHouseName = undefined;
    }
    submitMutation.mutate(data);
  };

  const handleSubmitAnother = () => {
    form.reset();
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${landingImage})` }}
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-background/95 backdrop-blur-sm">
          <CardContent className="pt-8 pb-8 text-center space-y-6">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Check className="w-8 h-8 text-primary" data-testid="icon-success" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold" data-testid="text-success-title">
                Thanks for submitting
              </h2>
              <p className="text-muted-foreground" data-testid="text-success-message">
                Your information has been recorded successfully.
              </p>
            </div>
            <Button
              onClick={handleSubmitAnother}
              variant="secondary"
              className="gap-2"
              data-testid="button-submit-another"
            >
              <RotateCcw className="w-4 h-4" />
              Submit Another Response
            </Button>
          </CardContent>
        </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${landingImage})` }}
      />
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-background/95 backdrop-blur-sm">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-3xl font-semibold" data-testid="text-form-title">
            Submit Your Information
          </CardTitle>
          <CardDescription data-testid="text-form-description">
            Please fill out the form below to submit your details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Name / பெயர் / పేరు <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your full name"
                        {...field}
                        data-testid="input-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Phone Number / ொலைபேசி எண் / టెలిఫోన్ నంబర్ <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your phone number"
                        type="tel"
                        {...field}
                        data-testid="input-phone"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="community"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Community
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled
                        className="bg-muted cursor-not-allowed"
                        data-testid="input-community"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Gender / பாலினம் / లింగం <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-gender">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {GENDER_OPTIONS.map((option) => (
                            <SelectItem key={option} value={option} data-testid={`option-gender-${option.toLowerCase()}`}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Date of Birth / பிறந்த தேதி / పుట్టిన తేదీ <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          max={new Date().toISOString().split("T")[0]}
                          data-testid="input-dob"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="presentAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Present Address / முகவரி / చిరునామా <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your present address"
                        {...field}
                        rows={3}
                        data-testid="input-address"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nativePlace"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Native Place <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your native place"
                        {...field}
                        data-testid="input-native-place"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gothram"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>
                      Gothram / கோத்திரம / గోత్రం <span className="text-destructive">*</span>
                    </FormLabel>
                    <Popover open={gothramOpen} onOpenChange={setGothramOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={gothramOpen}
                            className={cn(
                              "w-full justify-between font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                            data-testid="select-gothram"
                          >
                            {field.value || "Search and select your Gothram"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Search Gothram..." />
                          <CommandList>
                            <CommandEmpty>No Gothram found.</CommandEmpty>
                            <CommandGroup>
                              {GOTHRAM_OPTIONS.map((option) => (
                                <CommandItem
                                  key={option}
                                  value={option}
                                  onSelect={() => {
                                    field.onChange(option);
                                    form.setValue("houseName", "");
                                    setGothramOpen(false);
                                  }}
                                  data-testid={`option-gothram-${option.toLowerCase().replace(/\s+/g, "-")}`}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === option ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {option}
                                </CommandItem>
                              ))}
                              <CommandItem
                                key="other"
                                value="Other"
                                onSelect={() => {
                                  field.onChange("Other");
                                  form.setValue("houseName", "Other");
                                  setGothramOpen(false);
                                }}
                                data-testid="option-gothram-other"
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value === "Other" ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                Other
                              </CommandItem>
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedGothram && selectedGothram !== "Other" && (
                <FormField
                  control={form.control}
                  name="houseName"
                  render={({ field }) => (
                    <FormItem className="flex flex-col animate-in slide-in-from-top-2 duration-200">
                      <FormLabel>
                        House Name <span className="text-destructive">*</span>
                      </FormLabel>
                      <Popover open={houseNameOpen} onOpenChange={setHouseNameOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={houseNameOpen}
                              className={cn(
                                "w-full justify-between font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                              data-testid="select-housename"
                            >
                              {field.value || "Select your House Name"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0" align="start">
                          <Command>
                            <CommandInput placeholder="Search House Name..." />
                            <CommandList>
                              <CommandEmpty>No House Name found.</CommandEmpty>
                              <CommandGroup>
                                {houseNameOptions.map((option) => (
                                  <CommandItem
                                    key={option}
                                    value={option}
                                    onSelect={() => {
                                      field.onChange(option);
                                      setHouseNameOpen(false);
                                    }}
                                    data-testid={`option-housename-${option.toLowerCase().replace(/\s+/g, "-")}`}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        field.value === option ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    {option}
                                  </CommandItem>
                                ))}
                                <CommandItem
                                  key="other-house"
                                  value="Other"
                                  onSelect={() => {
                                    field.onChange("Other");
                                    setHouseNameOpen(false);
                                  }}
                                  data-testid="option-housename-other"
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === "Other" ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  Other
                                </CommandItem>
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {selectedGothram === "Other" && (
                <div className="space-y-4 animate-in slide-in-from-top-2 duration-200">
                  <FormField
                    control={form.control}
                    name="otherGothram"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Please specify Gothram <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your Gothram"
                            {...field}
                            data-testid="input-other-gothram"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="otherHouseName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Please specify House Name <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your House Name"
                            {...field}
                            data-testid="input-other-housename"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {form.watch("houseName") === "Other" && selectedGothram !== "Other" && (
                <FormField
                  control={form.control}
                  name="otherHouseName"
                  render={({ field }) => (
                    <FormItem className="animate-in slide-in-from-top-2 duration-200">
                      <FormLabel>
                        Please specify House Name <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your House Name"
                          {...field}
                          data-testid="input-other-housename-only"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        State / மாநிலம் / రాష్ట్రం <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter state"
                          {...field}
                          data-testid="input-state"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="county"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        County / நாடு / దేశం <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter county"
                          {...field}
                          data-testid="input-county"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="w-full md:w-auto md:min-w-[200px] md:mx-auto md:flex gap-2"
                disabled={submitMutation.isPending}
                data-testid="button-submit"
              >
                {submitMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
