const testimonials = [
  {
    body: "I used to spend 20 minutes staring at my closet. Now I'm out the door looking great.",
    author: {
      name: "Sarah Chen",
      label: "Fashion Blogger",
      imageUrl: "/professional-woman-smiling-portrait.png",
    },
  },
  {
    body: "Having an AI that actually understands my style is life-changing. So many compliments!",
    author: {
      name: "Marcus Johnson",
      label: "Software Engineer",
      imageUrl: "/young-man-portrait-casual-style.jpg",
    },
  },
  {
    body: "The privacy-first approach sold me. Plus the recommendations are spot-on!",
    author: {
      name: "Emily Rodriguez",
      label: "Creative Director",
      imageUrl: "/woman-portrait-creative-professional.jpg",
    },
  },
  {
    body: "Finally, an app that works with my actual wardrobe, not random products I don't own.",
    author: {
      name: "Alex Kim",
      label: "Marketing Manager",
      imageUrl: "/placeholder.svg",
    },
  },
  {
    body: "The outfit explanations help me understand styling better. I'm learning while looking good.",
    author: {
      name: "Jordan Taylor",
      label: "Graduate Student",
      imageUrl: "/placeholder.svg",
    },
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-32 lg:py-40 bg-secondary/30">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-xs font-semibold text-primary uppercase tracking-[0.15em] mb-3">TESTIMONIALS</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Loved by style-seekers everywhere
          </p>
          <p className="mt-4 text-base leading-7 text-muted-foreground max-w-xl mx-auto">
            Join thousands who've transformed their daily outfit decisions.
          </p>
        </div>

        <div className="overflow-x-auto scrollbar-hide -mx-6 px-6">
          <div className="flex gap-6 pb-4 snap-x snap-mandatory scroll-smooth" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.author.name}
                className="flex-shrink-0 w-80 snap-start bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02] hover:border-primary/20 transition-all duration-300"
              >
                <p className="text-foreground leading-relaxed mb-6 text-sm">{testimonial.body}</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <img
                      className="h-10 w-10 rounded-full object-cover"
                      src={testimonial.author.imageUrl || "/placeholder.svg"}
                      alt={testimonial.author.name}
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{testimonial.author.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.author.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
