# Demonstrating readable variable naming and meaningful comments

# ❌ Poor variable naming (unclear intent)
x = 50
y = 10
z = x - y
print(z)


# ✅ Good variable naming (clear and descriptive)
total_marks = 50
marks_deducted = 10
final_score = total_marks - marks_deducted
print(final_score)


# ❌ Bad comment (explains obvious operation)
result = total_marks - marks_deducted  # subtracting values


# ✅ Good comment (explains purpose)
# Calculate final score after deduction to determine performance
final_result = total_marks - marks_deducted


# ❌ Inconsistent naming (not following PEP 8)
UserAge = 21


# ✅ PEP 8 naming convention (snake_case)
user_age = 21


# Using meaningful variable in output
print("User age:", user_age)