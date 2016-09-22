# Matrix of regular dodecahedron vertex coordinates (see
# https://en.wikipedia.org/wiki/Regular_dodecahedron#Cartesian_coordinates).
phi = (1 + sqrt(5)) / 2
phi_inv = 1 / phi
vertices_3d = matrix(
  c(
    -1,       -1,       -1,             # (x1, y1, z1)
    -1,       -1,        1,
    -1,        1,       -1,
    -1,        1,        1,
     1,       -1,       -1,
     1,       -1,        1,
     1,        1,       -1,
     1,        1,        1,
     0,       -phi_inv, -phi,
     0,       -phi_inv,  phi,
     0,        phi_inv, -phi,
     0,        phi_inv,  phi,
    -phi_inv, -phi,      0,
    -phi_inv,  phi,      0,
     phi_inv, -phi,      0,
     phi_inv,  phi,      0,
    -phi,      0,       -phi_inv,
    -phi,      0,        phi_inv,
     phi,      0,       -phi_inv,
     phi,      0,        phi_inv        # (x20, y20, z20)
  ),
  nrow=3,
  ncol=20
)

# Rotation matrix of +60 degrees about the x-axis to bring a facet normal to the
# z-axis.
rotate_x_pos60 = matrix(
  c(
    1, 0,            0,
    0, cos(pi / 3), -sin(pi / 3),
    0, sin(pi / 3),  cos(pi / 3)
  ),
  nrow=3,
  ncol=3,
  byrow=TRUE
)

# Rotate die to generate 2D view from above while it is at rest on a surface.
vertices_3d_rot = rotate_x_pos60 %*% vertices_3d

# Extract 2D vertex coordinates and order them in such a way to optimize
# drawing.  The 2D vertices are as labeled below.  (**) represents the origin.
#
#                 ( 6)
#       (15)                ( 7)
#                 ( 1)
#  (14)                          ( 8)
#       ( 5)                ( 2)
#                 (**)
#  (13)                          ( 9)
#            ( 4)      ( 3)
#       (12)                (10)
#                 (11)
#
vertices_2d = matrix(
  c(
    vertices_3d_rot[1, 12], vertices_3d_rot[2, 12],     # (x'1, y'1)
    vertices_3d_rot[1,  8], vertices_3d_rot[2,  8],
    vertices_3d_rot[1, 16], vertices_3d_rot[2, 16],
    vertices_3d_rot[1, 14], vertices_3d_rot[2, 14],
    vertices_3d_rot[1,  4], vertices_3d_rot[2,  4],
    vertices_3d_rot[1, 10], vertices_3d_rot[2, 10],
    vertices_3d_rot[1,  6], vertices_3d_rot[2,  6],
    vertices_3d_rot[1, 20], vertices_3d_rot[2, 20],
    vertices_3d_rot[1, 19], vertices_3d_rot[2, 19],
    vertices_3d_rot[1,  7], vertices_3d_rot[2,  7],
    vertices_3d_rot[1, 11], vertices_3d_rot[2, 11],
    vertices_3d_rot[1,  3], vertices_3d_rot[2,  3],
    vertices_3d_rot[1, 17], vertices_3d_rot[2, 17],
    vertices_3d_rot[1, 18], vertices_3d_rot[2, 18],
    vertices_3d_rot[1,  2], vertices_3d_rot[2,  2]      # (x'15, y'15)
  ),
  nrow=2,
  ncol=15
)
