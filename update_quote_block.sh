#!/usr/bin/env bash
set -euo pipefail

read -r -d '' REPL <<'HTML'
          <div class="grid-2">
            <label class="field">
              <span>Company Name</span>
              <input name="company" type="text" placeholder="Company name" autocomplete="organization" required />
            </label>
            <label class="field">
              <span>Phone Number</span>
              <input name="phone" type="tel" placeholder="Phone number" autocomplete="tel" inputmode="tel" required />
            </label>
          </div>

          <label class="field span-2">
            <span>Email Address</span>
            <input name="email" type="email" placeholder="name@company.com" autocomplete="email" required />
          </label>

          <div class="grid-3">
            <label class="field">
              <span>Services</span>
              <select name="service" required>
                <option value="" selected disabled>Select one</option>
                <option>Air Freight</option>
                <option>Ocean Freight (FCL/LCL)</option>
                <option>Road &amp; Rail</option>
                <option>Customs Clearance</option>
                <option>Warehousing &amp; Distribution</option>
                <option>Door-to-Door Logistics</option>
                <option>Temperature-Controlled</option>
                <option>Other</option>
              </select>
            </label>
            <label class="field">
              <span>Origin</span>
              <input name="origin" type="text" placeholder="City, Country" required />
            </label>
            <label class="field">
              <span>Destination</span>
              <input name="destination" type="text" placeholder="City, Country" required />
            </label>
          </div>

          <div class="grid-2">
            <label class="field">
              <span>Cargo Details</span>
              <input name="cargo" type="text" placeholder="e.g., 2 pallets, 450 kg, non-haz" />
            </label>
            <label class="field">
              <span>Ready Date</span>
              <input name="ready_date" type="date" required />
            </label>
          </div>

          <label class="field span-2">
            <span>Notes</span>
            <textarea name="notes" rows="4" placeholder="Incoterms, dimensions, special handling, temperature range, etc."></textarea>
          </label>
HTML

for f in index.html services.html about.html contact.html; do
  path="/mnt/data/swift_work/${f}"
  [[ -f "$path" ]] || continue

  perl -0777 -i -pe 'use strict; use warnings; my $repl = $ENV{REPL};
    # replace the entire form body between the hidden fields and the form actions
    s~\n\s*<div class="grid-2">\s*\n\s*<label class="field">\s*\n\s*<span>Full name</span>.*?\n\s*</label>\s*\n\s*</label>\s*\n\s*</div>\s*\n\s*<div class="grid-3">.*?\n\s*</label>\s*\n\s*<label class="field">\s*\n\s*<span>Notes</span>\s*\n\s*<textarea name="notes".*?</textarea>\s*\n\s*</label>~\n$repl~s;
  ' "$path"
done
