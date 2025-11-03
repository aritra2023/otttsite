import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShieldCheck, AlertCircle, FileText, Lock } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navbar onSearch={() => {}} />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4" data-testid="icon-terms-hero">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent" data-testid="text-terms-title">
            Terms & Conditions
          </h1>
          <p className="text-muted-foreground text-lg" data-testid="text-updated-date">Updated at 2025-09-18</p>
        </div>

        <div className="space-y-8">
          {/* General Terms */}
          <Card data-testid="section-general-terms">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <ShieldCheck className="h-6 w-6 text-primary" />
                General Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                By accessing and placing an order with <span className="font-bold text-foreground">Subflix</span>, you confirm that you are in agreement with and bound by the terms of service contained in the Terms & Conditions outlined below. These terms apply to the entire website and any email or other type of communication between you and Subflix.
              </p>
              <p>
                Under <span className="font-bold text-foreground">no circumstances</span> shall Subflix team be liable for any direct, indirect, special, incidental, or consequential damages, including, but not limited to, loss of data or profit, arising out of the use, or the inability to use, the materials on this site, even if Subflix team or an authorized representative has been advised of the possibility of such damages. If your use of materials from this site results in the need for servicing, repair, or correction of equipment or data, you assume any costs thereof.
              </p>
            </CardContent>
          </Card>

          {/* Things to Note */}
          <Card className="border-primary/20 bg-primary/5" data-testid="section-things-to-note">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <AlertCircle className="h-6 w-6 text-primary" />
                Things to Note
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-bold text-lg text-foreground mb-3" data-testid="text-shared-platform-heading">Shared Subscription Platform</h3>
                <p className="text-muted-foreground leading-relaxed">
                  As <span className="font-bold text-foreground">Subflix is a shared subscription platform</span>, all subscriptions listed on our website are <span className="font-bold text-foreground">shared plans</span>. This means the plan is shared with the required number of users to bring the cost down, unless it is explicitly mentioned as <span className="font-bold text-foreground">"private"</span> or <span className="font-bold text-foreground">"on your number/mail"</span> in the plan name. If any user wants a private plan, they can opt for that.
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="font-bold text-lg text-foreground mb-3" data-testid="text-refund-policy-heading">No Cancellation or Refund Policy</h3>
                <p className="text-muted-foreground leading-relaxed">
                  <span className="font-bold text-foreground">Once a plan has been purchased, it cannot be cancelled or refunded.</span> Instead, you will receive a Subflix discount code equal to the value of your order, which can be redeemed on your next purchase. Please consider this carefully before completing your purchase.
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="font-bold text-lg text-foreground mb-3" data-testid="text-sharing-examples-heading">Shared Plan User Sharing Examples</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><span className="font-semibold text-foreground">Netflix</span> (8 users)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><span className="font-semibold text-foreground">Prime video</span> (5 users)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><span className="font-semibold text-foreground">Zee5</span> (4 users)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><span className="font-semibold text-foreground">Crunchy roll</span> (5 users)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><span className="font-semibold text-foreground">Aha</span> (5 users)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><span className="font-semibold text-foreground">Jio Hotstar</span> (6 users)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><span className="font-semibold text-foreground">Sony Liv</span> (3 users)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><span className="font-semibold text-foreground">Netflix private</span> (5 users) etc.</span>
                  </li>
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="font-bold text-lg text-foreground mb-3" data-testid="text-device-limits-heading">Note on Device Limits</h3>
                <p className="text-muted-foreground leading-relaxed">
                  In a shared plan, users may occasionally face <span className="font-bold text-foreground">device limit issues</span> as other users are playing at the same time. Users can either wait till the other user finishes watching, or they can download and watch, or they may upgrade to the private plan. This sharing model is implemented to bring the price down.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* License */}
          <Card data-testid="section-license">
            <CardHeader>
              <CardTitle className="text-2xl">License</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
              <p>
                Subflix grants you a <span className="font-bold text-foreground">revocable, non-exclusive, non-transferable, limited license</span> to download, install and use the website strictly in accordance with the terms of this Agreement. These Terms & Conditions are a contract between you and Subflix (referred to in these Terms & Conditions as "Subflix", "us", "we" or "our"), the provider of the Subflix website and the services accessible from the Subflix website (collectively referred to as the "Subflix Service"). You are agreeing to be bound by this Agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </CardContent>
          </Card>

          {/* Definitions */}
          <Card data-testid="section-definitions">
            <CardHeader>
              <CardTitle className="text-2xl">Definitions and Key Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground mb-4">To help explain things as clearly as possible:</p>
              <div className="space-y-3">
                <div>
                  <span className="font-bold text-foreground">Company/We/Us/Our:</span>
                  <span className="text-muted-foreground ml-2">Refers to Subflix.</span>
                </div>
                <div>
                  <span className="font-bold text-foreground">Country:</span>
                  <span className="text-muted-foreground ml-2">India.</span>
                </div>
                <div>
                  <span className="font-bold text-foreground">Device:</span>
                  <span className="text-muted-foreground ml-2">Any internet-connected device (phone, tablet, computer, etc.) used to visit Subflix and use the services.</span>
                </div>
                <div>
                  <span className="font-bold text-foreground">Service:</span>
                  <span className="text-muted-foreground ml-2">Refers to the service provided by Subflix as described on this platform.</span>
                </div>
                <div>
                  <span className="font-bold text-foreground">Third-party service:</span>
                  <span className="text-muted-foreground ml-2">Refers to advertisers, partners, and others who provide content or whose products/services may interest you.</span>
                </div>
                <div>
                  <span className="font-bold text-foreground">Website:</span>
                  <span className="text-muted-foreground ml-2">Subflix's site.</span>
                </div>
                <div>
                  <span className="font-bold text-foreground">You:</span>
                  <span className="text-muted-foreground ml-2">A person or entity registered with Subflix to use the Services.</span>
                </div>
                <div>
                  <span className="font-bold text-foreground">Cookie:</span>
                  <span className="text-muted-foreground ml-2">Small amount of data generated by a website and saved by your web browser.</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Restrictions */}
          <Card data-testid="section-restrictions">
            <CardHeader>
              <CardTitle className="text-2xl">Restrictions</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
              <p className="mb-3">You agree not to, and you will not permit others to:</p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">a)</span>
                  <span>License, sell, rent, lease, assign, distribute, transmit, host, outsource, disclose or otherwise commercially exploit the website or make the platform available to any third party.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">b)</span>
                  <span>Modify, make derivative works of, disassemble, decrypt, reverse compile or reverse engineer any part of the website.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">c)</span>
                  <span>Remove, alter or obscure any proprietary notice (including any notice of copyright or trademark) of Subflix or its affiliates, partners, suppliers or the licensors of the website.</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Payment */}
          <Card data-testid="section-payment">
            <CardHeader>
              <CardTitle className="text-2xl">Payment</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
              <p>
                If you pay for any of our one-time payment plans, you agree to pay all fees or charges to your account for the Service in accordance with the fees, charges, and billing terms. Your Payment Provider agreement governs your use of the designated credit card account. By providing Subflix with your payment information, you agree that Subflix is authorized to verify the information and subsequently invoice your account for all fees and charges due. You agree to immediately notify Subflix of any change in your billing address or the credit card used for payment hereunder.
              </p>
            </CardContent>
          </Card>

          {/* Your Suggestions */}
          <Card data-testid="section-suggestions">
            <CardHeader>
              <CardTitle className="text-2xl">Your Suggestions</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
              <p>
                Any feedback, comments, ideas, improvements or suggestions ("Suggestions") provided by you to Subflix shall remain the <span className="font-bold text-foreground">sole and exclusive property of Subflix</span>. Subflix shall be free to use, copy, modify, publish, or redistribute the Suggestions for any purpose and in any way without any credit or compensation to you.
              </p>
            </CardContent>
          </Card>

          {/* Your Consent */}
          <Card data-testid="section-consent">
            <CardHeader>
              <CardTitle className="text-2xl">Your Consent</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
              <p>
                By using our website, registering an account, or making a purchase, you hereby <span className="font-bold text-foreground">consent to our Terms & Conditions</span>.
              </p>
            </CardContent>
          </Card>

          {/* Links to Other Websites */}
          <Card data-testid="section-links">
            <CardHeader>
              <CardTitle className="text-2xl">Links to Other Websites</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
              <p>
                These Terms & Conditions apply only to the Services provided on our Website. The Services may contain links to other websites not operated or controlled by Subflix. We are <span className="font-bold text-foreground">not responsible</span> for the content, accuracy, or opinions expressed in such websites. Your browsing and interaction on any other website is subject to that website's own rules and policies.
              </p>
            </CardContent>
          </Card>

          {/* Cookies */}
          <Card data-testid="section-cookies">
            <CardHeader>
              <CardTitle className="text-2xl">Cookies</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
              <p>
                Subflix uses "Cookies" to identify the areas of our website that you have visited. We use cookies to enhance performance and functionality, but they are non-essential to use. If you disable Cookies, certain functionality may become unavailable. We <span className="font-bold text-foreground">never place Personally Identifiable Information in Cookies</span>.
              </p>
            </CardContent>
          </Card>

          {/* Modifications */}
          <Card data-testid="section-modifications">
            <CardHeader>
              <CardTitle className="text-2xl">Modifications to Our Website</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
              <p>
                Subflix solely reserves the right to modify, suspend or discontinue, temporarily or permanently, the website or any service to which it connects, with or without notice and <span className="font-bold text-foreground">without liability to you</span>.
              </p>
            </CardContent>
          </Card>

          {/* Term and Termination */}
          <Card data-testid="section-termination">
            <CardHeader>
              <CardTitle className="text-2xl">Term and Termination</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
              <p>
                This Agreement shall remain in effect until terminated by you or Subflix. Subflix may, in its sole discretion, at any time and for any or no reason, suspend or terminate this Agreement with or without prior notice.
              </p>
            </CardContent>
          </Card>

          {/* Indemnification */}
          <Card data-testid="section-indemnification">
            <CardHeader>
              <CardTitle className="text-2xl">Indemnification</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
              <p>
                You agree to <span className="font-bold text-foreground">indemnify and hold Subflix</span> and its parents, subsidiaries, affiliates, officers, employees, agents, partners, and licensors (if any) harmless from any claim or demand, including reasonable attorneys' fees, due to or arising out of your: (a) use of the website; (b) violation of this Agreement or any law or regulation; or (c) violation of any right of a third party.
              </p>
            </CardContent>
          </Card>

          {/* No Warranties */}
          <Card data-testid="section-warranties">
            <CardHeader>
              <CardTitle className="text-2xl">No Warranties</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
              <p>
                The Website is provided to you <span className="font-bold text-foreground">"AS IS"</span> and <span className="font-bold text-foreground">"AS AVAILABLE"</span> and without warranty of any kind. Subflix expressly disclaims all warranties, whether express, implied, statutory, or otherwise, including all implied warranties of merchantability, fitness for a particular purpose, title, and non-infringement. Subflix provides no warranty that the website will meet your requirements, operate without interruption, or be error-free.
              </p>
            </CardContent>
          </Card>

          {/* Limitation of Liability */}
          <Card data-testid="section-liability">
            <CardHeader>
              <CardTitle className="text-2xl">Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
              <p>
                The entire liability of Subflix and any of its suppliers under any provision of this Agreement shall be <span className="font-bold text-foreground">limited to the amount actually paid by you for the Website</span>. To the maximum extent permitted by applicable law, in no event shall Subflix or its suppliers be liable for any special, incidental, indirect, or consequential damages whatsoever.
              </p>
            </CardContent>
          </Card>

          {/* Choice of Law */}
          <Card data-testid="section-law">
            <CardHeader>
              <CardTitle className="text-2xl">Choice of Law and Venue</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
              <p>
                The Terms of Use and policies shall be expounded and construed with and by the <span className="font-bold text-foreground">laws of India</span>, regardless of its conflict to laws and rules in India. Disputes of any sort will be subject to the <span className="font-bold text-foreground">exclusive jurisdiction of the courts situated within New Delhi</span>, and the user hereby will have to comply with the jurisdiction of the courts of Delhi.
              </p>
            </CardContent>
          </Card>

          {/* Privacy Policy */}
          <Card className="border-primary/20 bg-primary/5" data-testid="section-privacy">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Lock className="h-6 w-6 text-primary" />
                Privacy Policy
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2">Updated at 2025-07-23 | Effective Date: 1 January 2024</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-bold text-lg text-foreground mb-3">1. Introduction</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Welcome to Subflix. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you visit our website and use our services.
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="font-bold text-lg text-foreground mb-3">2. Information We Collect</h3>
                <p className="text-muted-foreground mb-2">Personal Information: We collect the following personal information from you:</p>
                <ul className="space-y-2 text-muted-foreground ml-6">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span className="font-semibold text-foreground">Name</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span className="font-semibold text-foreground">Phone Number</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span className="font-semibold text-foreground">WhatsApp Number</span>
                  </li>
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="font-bold text-lg text-foreground mb-3">3. How We Use Your Information</h3>
                <div className="space-y-3 text-muted-foreground">
                  <div>
                    <span className="font-semibold text-foreground">Order Processing:</span>
                    <span className="ml-2">We use your personal information to keep records of your orders and ensure proper order fulfillment.</span>
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">Customer Communication:</span>
                    <span className="ml-2">We may use your contact information to communicate with you regarding your orders or provide customer support.</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-bold text-lg text-foreground mb-3">4. Data Security</h3>
                <div className="space-y-3 text-muted-foreground">
                  <div>
                    <span className="font-semibold text-foreground">Storage:</span>
                    <span className="ml-2">Your personal information is stored securely on our website server.</span>
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">Protection:</span>
                    <span className="ml-2">We implement industry-standard security measures to protect your data from unauthorized access, alteration, or disclosure.</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-bold text-lg text-foreground mb-3">5. Data Sharing</h3>
                <p className="text-muted-foreground leading-relaxed">
                  <span className="font-bold text-foreground">No Sharing:</span> We <span className="font-bold text-foreground">do not share</span> your personal information with any third parties. Your data is used solely for internal purposes related to order processing and fulfillment.
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="font-bold text-lg text-foreground mb-3">6. Cookies and Tracking</h3>
                <p className="text-muted-foreground leading-relaxed">
                  <span className="font-bold text-foreground">No Cookies:</span> We do not use cookies or other tracking technologies on our website.
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="font-bold text-lg text-foreground mb-3">7. User Rights</h3>
                <div className="space-y-3 text-muted-foreground">
                  <div>
                    <span className="font-semibold text-foreground">Access and Correction:</span>
                    <span className="ml-2">You have the right to access and correct your personal information stored with us. If you need to update your information, please contact us at the details below.</span>
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">Deletion:</span>
                    <span className="ml-2">If you wish to request the deletion of your personal information, please contact us, and we will process your request in accordance with applicable laws.</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery & Payment Policy */}
          <Card data-testid="section-delivery">
            <CardHeader>
              <CardTitle className="text-2xl">Delivery & Payment Policy</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">Updated at 2024-11-20</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-bold text-lg text-foreground mb-3">Delivery of Digital Subscriptions</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We endeavour to complete all products ordered (i.e., provide the subscription account access details/credentials) <span className="font-bold text-foreground">within 48 hours</span> after the order has been placed and accepted by us. You will be given an indication of the expected delivery time when you place your order online.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  You need to <span className="font-bold text-foreground">acknowledge receipt</span> of the products (account credentials) when the details are provided, and by doing so, you accept the responsibility for the products ordered from that moment on. If the recipient is not the original purchaser (e.g., a gift), then acceptance by the recipient serves as evidence of delivery and fulfillment of your order.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  <span className="font-semibold text-foreground">Note on Delivery Time:</span> Delivery of digital access details may vary, but we endeavor to complete orders as quickly as possible, generally within 48 hours. This policy applies only to the delivery of digital subscription access.
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="font-bold text-lg text-foreground mb-3">Additional Charges</h3>
                <p className="text-muted-foreground leading-relaxed">
                  There are <span className="font-bold text-foreground">no additional charges</span>. The total payable amount is indicated on the individual items.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Us */}
          <Card className="border-primary/50 bg-gradient-to-br from-primary/5 to-primary/10" data-testid="section-contact">
            <CardHeader>
              <CardTitle className="text-2xl">Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">Don't hesitate to contact us if you have any questions.</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xl">📞</span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Via Phone Number (WhatsApp/Call)</p>
                    <a href="tel:+919433419022" className="font-bold text-foreground hover:text-primary transition-colors" data-testid="text-contact-phone">
                      9433419022
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xl">✉️</span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Via Email</p>
                    <a href="mailto:info@subflix.com" className="font-bold text-foreground hover:text-primary transition-colors" data-testid="text-contact-email">
                      info@subflix.com
                    </a>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">Business Hours:</span> 11 AM to 10 PM, Monday to Saturday
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
